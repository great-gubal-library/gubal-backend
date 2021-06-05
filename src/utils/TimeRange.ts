import * as _ from 'lodash';
import { withBeginningOfDay, withEndOfDay } from './dateUtils';

export class TimeRange {
  static forDuration(start: Date, durationMinutes: number): TimeRange {
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMinutes);
    return new TimeRange(start, end);
  }

  static forDay(day: Date): TimeRange {
    return new TimeRange(withBeginningOfDay(day), withEndOfDay(day));
  }

  constructor(readonly start: Date, readonly end: Date) {

  }

  isEmpty() {
    return this.start >= this.end;
  }

  includes(t: TimeRange) {
    return this.start <= t.start && this.end > t.end;
  }

  subtract(range: TimeRange): TimeRange[] {
    if (this.start >= range.end || this.end <= range.start)
      return [this];
    else if (
      (this.start.getTime() === range.start.getTime() && this.end.getTime() === range.end.getTime()) ||
      (this.start > range.start && this.end < range.end)
    )
      return [];
    else if (this.start <= range.start && this.end <= range.end)
      return [
        new TimeRange(this.start, range.start)
      ]
    else if (this.start >= range.start && this.end >= range.end)
      return [
        new TimeRange(range.end, this.end)
      ]
    else
      return [
        new TimeRange(this.start, range.start),
        new TimeRange(range.end, this.end)
      ]
  }

  iterate<T>({ stepMinutes, stepDays }: { stepMinutes?: number, stepDays?: number }): (handler: (d: Date) => T) => T[] {
    let stepFn: (d: Date) => void;

    if (stepMinutes)
      stepFn = (d: Date) => d.setMinutes(d.getMinutes() + stepMinutes);
    else if (stepDays)
      stepFn = (d: Date) => d.setDate(d.getDate() + stepDays);
    else
      throw Error('No step specified for iterate');

    return (handler) => {
      const out = [];
      for (const iter = new Date(this.start); iter <= this.end; stepFn(iter)) {
        out.push(handler(new Date(iter)));
      }
      return out;
    }
  }

  array(params: { stepMinutes?: number, stepDays?: number }): Date[] {
    return this.iterate<Date>(params)(d => d);
  }
}

export class TimeRangeSet {
  static create(...ranges: TimeRange[]) {
    return new TimeRangeSet(
      _.chain(ranges)
        .sortBy(v => v.start)
        .reduce(mergeSortedTimeRanges, [])
        .value()
    )
  }

  static empty = new TimeRangeSet([])

  readonly ranges: TimeRange[];

  private constructor(ranges: TimeRange[]) {
    this.ranges = ranges.filter(v => !v.isEmpty());
  }

  get start(): Date | null {
    return this.ranges.length === 0
      ? null
      : this.ranges[0].start;
  }

  get end(): Date | null {
    return this.ranges.length === 0
      ? null
      : this.ranges[this.ranges.length - 1].end;
  }

  isEmpty() {
    return this.ranges.length === 0;
  }

  includes(range: TimeRange): boolean {
    return this.ranges.find(r => r.includes(range)) !== undefined;
  }

  subtract(range: TimeRange): TimeRangeSet {
    return new TimeRangeSet(
      _.flatMap(this.ranges, r => r.subtract(range))
        .filter(v => !v.isEmpty())
    );
  }
}

const mergeSortedTimeRanges =
  (acc: TimeRange[], range: TimeRange) => {
    if (acc.length === 0)
      return [range];

    const prev = acc[acc.length - 1];
    if (prev.end >= range.start)
      return [...acc.slice(-1), new TimeRange(prev.start, range.end)]
    else
      return [...acc, range];
  };
