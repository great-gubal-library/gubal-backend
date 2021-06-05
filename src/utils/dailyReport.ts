import { promises as fs } from 'fs';
import moment = require('moment');

const DailyReportTemplatePath = 'templates/report_template.html';

export interface CreateDailyReportParameters {
  company: {
    name: string,
    address: string[],
    businessId?: string
  },
  payments: {
    date: string,
    total: string,
    extraServices: string
  }[],
  currentDate: Date,
  startDate: Date,
  endDate: Date
}

export async function createDailyReport(
  { company, payments, currentDate, startDate, endDate }: CreateDailyReportParameters
): Promise<string> {
  const template = (await fs.readFile(DailyReportTemplatePath)).toLocaleString();

  const titleField = h2Field('Päiväkohtaiset rahavirrat')

  const companyFields = [
    divField('Yritys', company.name),
    ...company.address.map(row => divField('Osoite', row)),
    divField('Y-tunnus', company.businessId),
  ].reduce((acc, s) => acc + s, '');

  const dateFields = [
    divField('Myynti välillä', moment(startDate).format('DD.MM.YYYY') + ' - ' + moment(endDate).format('DD.MM.YYYY')),
    divField('Raportti ladattu', moment(currentDate).format('DD.MM.YYYY, HH:mm')),
  ].reduce((acc, s) => acc + s, '');

  const paymentFields = payments.reduce(
    (acc, { date, total: paymentTotal, extraServices }) =>
      acc.concat([
        '<tr>',
        tdField(date),
        tdField(paymentTotal),
        tdField(extraServices),
        '</tr>'
      ])
    , []).reduce((acc, s) => acc + s, '');

  const headers = [
    '<tr>',
    '<th class="service">Päivä</th>',
    '<th class="tax">Palvelut</th>',
    '<th class="tax">Lisäpalvelut</th>',
    '</tr>'
  ].reduce((acc, s) => acc + s, '');

  const table = [
    '<table>',
    '<thead>',
    headers,
    '</thead>',
    '<tbody>',
    paymentFields,
    '</tbody>',
    '</table>'
  ].reduce((acc, s) => acc + s, '');

  return template
    .replace('<!-- TITLE -->', titleField)
    .replace('<!-- COMPANY -->', companyFields)
    .replace('<!-- DATES -->', dateFields)
    .replace('<!-- TABLES -->', table)
}

const h2Field = (value: string): string =>
  `<h2>${value}</h2>`

const divField = (title: string, value?: string): string =>
  !value ? '' : `<div class="field"><div class="field__label">${title}</div><div class="field__value">${value}</div></div>`;

const tdField = (value: string): string =>
  `<td>${value}</td>`;