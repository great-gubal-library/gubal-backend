import { promises as fs } from 'fs';
import moment = require('moment');

const ReceiptTemplatePath = 'templates/receipt_template.html';

export interface CreateReceiptParameters {
  company: {
    name: string,
    address: string[],
    phoneNumber?: string,
    email: string,
    businessId?: string
  },
  user?: {
    name: string,
    phoneNumber?: string,
    email: string,
    businessId: string
  },
  services: {
    name: string,
    priceWithoutTax: string,
    taxPercent: string,
    priceWithTax: string,
    discount?: string,
    total: string,
  }[],
  customerId: string,
  bookingId: string,
  date: Date,
  total: string,
}

export async function createReceipt(
  { company, user, services, date, total, customerId, bookingId }: CreateReceiptParameters
): Promise<string> {
  const hasDiscounts = services.find(v => v.discount !== undefined) !== undefined;

  const template = (await fs.readFile(ReceiptTemplatePath)).toLocaleString();

  const extendedCompanyFields = user !== undefined ? [] : [
    divField('Y-tunnus', company.businessId),
  ];

  const userFields = user === undefined ? [] : [
    '<br>',
    h3Field(user.name),
    divField('Puh.', user.phoneNumber),
    divField('Email', user.email),
    divField('Y-tunnus', user.businessId),
  ];

  const companyFields = [
    h2Field(company.name),
    ...company.address.map(row => divField('', row)),
    divField('Puh.', company.phoneNumber),
    divField('Email', company.email),
    ...extendedCompanyFields,
    ...userFields,
  ].reduce((acc, s) => acc + s, '');

  const infoFields = [
    infoField('Aikaleima', moment(date).format('DD.MM.YYYY HH:mm:SS')),
    infoField('Asiakasnumero', customerId),
    infoField('Varausnumero', bookingId),
  ].reduce((acc, s) => acc + s, '');

  const serviceFields = services.reduce(
    (acc, { name, priceWithoutTax: price, taxPercent, priceWithTax, discount, total: serviceTotal }) =>
      acc.concat([
        '<tr>',
        tdField(name),
        tdField(taxPercent),
        tdField(priceWithTax),
        hasDiscounts ? tdField(discount ?? '') : '',
        tdField(price),
        tdField(serviceTotal),
        '</tr>'
      ])
    , []).reduce((acc, s) => acc + s, '');

  const headers = [
    '<tr>',
    '<th class="service">Tuote/Palvelu</th>',
    '<th class="tax">ALV %</th>',
    '<th class="price1">Hinta</th>',
    hasDiscounts ? '<th class="discount">Alennus</th>' : '',
    '<th class="price1">Veroton hinta</th>',
    '<th class="price2">Yhteensä</th>',
    '</tr>'
  ].reduce((acc, s) => acc + s, '')

  const sumrow = [
    '<tr class="sumrow">',
    '<td class="bold">YHTEENSÄ</td>',
    '<td></td>',
    '<td></td>',
    hasDiscounts ? '<td></td>' : '',
    '<td></td>',
    `<td>${total}</td>`,
    '</tr>'
  ].reduce((acc, s) => acc + s, '')

  return template
    .replace('<!-- HEADERS -->', headers)
    .replace('<!-- COMPANY -->', companyFields)
    .replace('<!-- INFO -->', infoFields)
    .replace('<!-- SERVICES -->', serviceFields)
    .replace('<!-- SUMROW -->', sumrow);
}

const h2Field = (value: string): string =>
  `<h2>${value}</h2>`

const h3Field = (value: string): string =>
  `<h3>${value}</h3>`

const divField = (title: string, value?: string): string =>
  !value ? '' : `<div class="company-field">${title !== '' ? `${title}: ${value}` : value}</div>`;

const infoField = (title: string, value?: string): string =>
  !value ? '' : `<div class="field"><div class="label">${title}</div><div class="value">${value}</div></div>`

const tdField = (value: string): string =>
  `<td>${value}</td>`;