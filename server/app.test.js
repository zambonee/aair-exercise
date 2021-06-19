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

  describe("Error states", async() => {
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
});

describe('Test /api/locationToCurrency', () => {
  describe('Integration Tests', async() => {
    test('Returns MXN when IP location is in Mexico', async() => {
      // This test is fragile since country IP addresses are not static. This was mostly a sanity check for the ipapi service.
      const req = require('express/lib/request');
      jest.spyOn(req, 'ip', 'get').mockReturnValue('8.242.192.0');
      const response = await request(app).get('/api/locationToCurrency');
      expect(response.statusCode).toBe(200);
      expect(response.body.currency).toBe('MXN');
    });
  });
  describe("Mocked ipapi", async() => {
    const axios = require('axios');
    test('Returns value from ipapi', async() => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: 'MXN' });
      const response = await request(app).get('/api/locationToCurrency');
      expect(response.statusCode).toBe(200);
      expect(response.body.currency).toBe('MXN');
    });
    test('Returns 404 error when ipapi returns 404', async() => {
      jest.spyOn(axios, 'get').mockRejectedValue({ status: 404, data: 'error not found' });
      const response = await request(app).get('/api/locationToCurrency');
      expect(response.statusCode).toBe(404);
    });
    test('Returns 500 error when ipapi returns non-404 error', async() => {
      jest.spyOn(axios, 'get').mockRejectedValue({ status: 429, data: 'quota exceeded' });
      const response = await request(app).get('/api/locationToCurrency');
      expect(response.statusCode).toBe(500);
    });
  });
});
