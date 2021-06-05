import { promises as fs } from 'fs';
import moment = require('moment');

const ReportTemplatePath = 'templates/report_template.html';

export interface CreateExtendedMonthlyReportParameters {
  company: {
    name: string,
    address: string[],
    businessId?: string
  },
  payments: {
    assignee: string,
    payments: {
      service: string,
      count: string,
      taxPercent: string,
      priceWithoutTax: string,
      taxValue: string,
      total: string
    }[],
    extraPayments: {
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

export async function createExtendedMonthlyReport(
  { company, payments, totals, currentDate, startDate, endDate }: CreateExtendedMonthlyReportParameters
): Promise<string> {
  const template = (await fs.readFile(ReportTemplatePath)).toLocaleString();

  const titleField = h2Field('Kuukausiraportti (tarkka)')

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

  const allPaymentsPerAssignee = payments.map(
    assigneePayments => ({
      assignee: assigneePayments.assignee,
      payments: assigneePayments.payments.reduce(
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
        , []).reduce((acc, s) => acc + s, ''),
      extraPayments: assigneePayments.extraPayments.reduce(
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
        , []).reduce((acc, s) => acc + s, ''),
      totals: [
        '<tr class="totals">',
        tdField(''),
        tdField(''),
        tdField(''),
        tdField(assigneePayments.totals.taxfreeTotal),
        tdField(assigneePayments.totals.portionOfTaxTotal),
        tdField(assigneePayments.totals.total),
        '</tr>'
      ].reduce((acc, s) => acc + s, '')
    }));

  const totalsHeader = [
    '<tr>',
    '<th class="service">Palvelut yhteensä</th>',
    '<th class="taxfree-price">Veroton</th>',
    '<th class="portion-of-tax">Vero</th>',
    '<th class="total">Summa</th>',
    '</tr>'
  ].reduce((acc, s) => acc + s, '');

  const totalsTable = [
    '<table>',
    '<thead>',
    totalsHeader,
    '</thead>',
    '<tbody>',
    '<tr>',
    tdField(''),
    tdField(totals.taxfreeTotal),
    tdField(totals.portionOfTaxTotal),
    tdField(totals.total),
    '</tr>',
    '</tbody>',
    '</table>'
  ].reduce((acc, s) => acc + s, '');

  const tables = allPaymentsPerAssignee.length ?
    allPaymentsPerAssignee.map(assigneePayments => [
        divField('Tekijä', assigneePayments.assignee),
        '<table>',
        '<thead>',
        headers,
        '</thead>',
        '<tbody>',
        assigneePayments.payments,
        assigneePayments.extraPayments.length ? subheader : '',
        assigneePayments.extraPayments.length ? assigneePayments.extraPayments : '',
        assigneePayments.totals,
        '</tbody>',
        '</table>'
      ].reduce((acc, s) => acc + s, '')
    ).reduce((acc, s) => acc + s, '').concat(totalsTable)
    : h2Field('Ei tuloksia');

  return template
    .replace('<!-- TITLE -->', titleField)
    .replace('<!-- COMPANY -->', companyFields)
    .replace('<!-- DATES -->', dateFields)
    .replace('<!-- TABLES -->', tables)
}

const h2Field = (value: string): string =>
  `<h2>${value}</h2>`

const divField = (title: string, value?: string): string =>
  !value ? '' : `<div class="field"><div class="field__label">${title}</div><div class="field__value">${value}</div></div>`;

const tdField = (value: string): string =>
  `<td>${value}</td>`;