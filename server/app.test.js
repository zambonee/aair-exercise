const request = require('supertest');
const app = require('./app');

describe('Test /api/currencyConverter', () => {
  test('Returns correct conversion for USD to USD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=USD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(10);
  });

  test('Returns correct conversion for USD to CAD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=CAD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(12.07);
  });

  test('Returns correct conversion for USD to DZD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(975.6);
  });
});

describe('Test /api/locationToCurrency', () => {
});
