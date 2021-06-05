import * as DineroNS from 'dinero.js';
import { Dinero } from 'dinero.js';

// Has to be cast because types are incorrect
(DineroNS as any).defaultCurrency = 'EUR';
(DineroNS as any).defaultPrecision = 2;

export const dineroFromFloat = (value: number | string) => {
  if(typeof value === 'string') {
    value = parseFloat(value);
    if(Number.isNaN(value))
      throw new Error('Expected float value')
  }

  if(typeof value !== 'number')
    throw new Error(`Invalid type ${typeof value}`)

  return DineroNS({ amount: Math.trunc(value * 100) });
}

export const dineroFromIntAmount = (value: number | string) => {
  if(typeof value === 'string') {
    value = parseInt(value, 10);
    if(Number.isNaN(value))
      throw new Error('Expected integer value')
  }

  if(typeof value !== 'number')
    throw new Error(`Invalid type ${typeof value}`)

  return DineroNS({ amount: Math.trunc(value) });
}