import { promises as fs } from 'fs';
import moment = require('moment');

const ReportTemplatePath = 'templates/report_template.html';

export interface CreateMonthlyReportParameters {
  company: {
    name: string,
    address: string[],
    businessId?: string
  },
  payments: {
    service: string,
    count: string,
    taxPercent: string,
    priceWithoutTax: string,
    taxValue: string,
    total: string
  }[],
  extraServicePayments: {
    service: string,
    count: string,
    taxPercent: string,
    priceWithoutTax: string,
    taxValue: string,
    total: string
  }[],
  totals: {
    taxfreeTotal: string,
    portionOfTaxTotal: string,
    total: string
  },
  currentDate: Date,
  startDate: Date,
  endDate: Date
}

export async function createMonthlyReport(
  { company, payments, extraServicePayments, totals, currentDate, startDate, endDate }: CreateMonthlyReportParameters
): Promise<string> {
  const template = (await fs.readFile(ReportTemplatePath)).toLocaleString();

  const titleField = h2Field('Kuukausiraportti (tiivis)')

  const companyFields = [
    divField('Yritys', company.name),
    ...company.address.map(row => divField('Osoite', row)),
    divField('Y-tunnus', company.businessId),
  ].reduce((acc, s) => acc + s, '');

  const dateFields = [
    divField('Myynti välillä', moment(startDate).format('DD.MM.YYYY') + ' - ' + moment(endDate).format('DD.MM.YYYY')),
    divField('Raportti ladattu', moment(currentDate).format('DD.MM.YYYY, HH:mm')),
  ].reduce((acc, s) => acc + s, '');

  const headers = [
    '<tr>',
    '<th class="service">Palvelut</th>',
    '<th class="count">kpl</th>',
    '<th class="tax-percent">Vero%</th>',
    '<th class="taxfree-price">Veroton</th>',
    '<th class="portion-of-tax">Vero</th>',
    '<th class="total">Summa</th>',
    '</tr>'
  ].reduce((acc, s) => acc + s, '');

  const subheader = [
    '<tr>',
    '<th class="service" colspan="6">Lisäpalvelut</th>',
    '</tr>'
  ].reduce((acc, s) => acc + s, '');

  const paymentFields = payments.reduce(
    (acc, { service, count, taxPercent, priceWithoutTax, taxValue, total }) =>
      acc.concat([
        '<tr>',
        tdField(service),
        tdField(count),
        tdField(taxPercent),
        tdField(priceWithoutTax),
        tdField(taxValue),
        tdField(total),
        '</tr>'
      ])
    , []).reduce((acc, s) => acc + s, '');

  const extraServicePaymentFields = extraServicePayments.reduce(
    (acc, { service, count, taxPercent, priceWithoutTax, taxValue, total }) =>
      acc.concat([
        '<tr>',
        tdField(service),
        tdField(count),
        tdField(taxPercent),
        tdField(priceWithoutTax),
        tdField(taxValue),
        tdField(total),
        '</tr>'
      ])
    , []).reduce((acc, s) => acc + s, '');

  const totalsRow = [
    '<tr class="totals">',
    tdField(''),
    tdField(''),
    tdField(''),
    tdField(totals.taxfreeTotal),
    tdField(totals.portionOfTaxTotal),
    tdField(totals.total),
    '</tr>'
  ].reduce((acc, s) => acc + s, '');

  const table = paymentFields.length ?
    [
      '<table>',
      '<thead>',
      headers,
      '</thead>',
      '<tbody>',
      paymentFields,
      extraServicePayments.length ? subheader : '',
      extraServicePayments.length ? extraServicePaymentFields : '',
      totalsRow,
      '</tbody>',
      '</table>'
    ].reduce((acc, s) => acc + s, '')
    : h2Field('Ei tuloksia')

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