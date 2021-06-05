// code copied from https://github.com/wbhob/nest-middlewares/tree/master/packages/morgan
// package.json has @types/morgan ^1.7.32 version definition which currently installs version 1.9 of @types/morgan
// this caused typescript errors in the build
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {

  public static configure(format: string | morgan.FormatFn, opts?: morgan.Options) {
    this.format = format;
    this.options = opts;
  }

  public static token(name: string, callback: morgan.TokenCallbackFn): morgan.Morgan {
    return morgan.token(name, callback);
  }

  private static options: morgan.Options;
  private static format: string | morgan.FormatFn;

  public use(req: any, res: any, next: any) {
    if (MorganMiddleware.format) {
      morgan(MorganMiddleware.format as any, MorganMiddleware.options)(req, res, next);
    } else {
      throw new Error('MorganMiddleware must be configured with a logger format.');
    }
  }
}
