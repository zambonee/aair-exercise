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

  test('Returns error when from currency is invalid', async() => {
    const response = await request(app).get('/api/currencyConverter?from=FOO&to=USD&amount=10');
    expect(response.statusCode).toBe(400);
  });

  test('Returns error when from currency is null', async() => {
    const response = await request(app).get('/api/currencyConverter?from=&to=USD&amount=10');
    expect(response.statusCode).toBe(400);
  });

  test('Returns error when to currency is invalid', async() => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=FOO&amount=10');
    expect(response.statusCode).toBe(400);
  });

  test('Returns error when to currency is null', async() => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=&amount=10');
    expect(response.statusCode).toBe(400);
  });

  test('Returns error when amount is invalid', async() => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=USD&amount=FOO');
    expect(response.statusCode).toBe(400);
  });

  test('Returns error when amount is null', async() => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=USD&amount=');
    expect(response.statusCode).toBe(400);
  });
});

describe('Test /api/locationToCurrency', () => {
});
