import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

beforeEach(() => {
  render(<App />);
})

test('renders heading text', async () => {
  expect(await screen.findByText("Currency Converter"));
});

test('hydrates from currencies from server', async () => {
  // jest.spyOn(global, 'fetch').mockResolvedValue({
  //   json: jest.fn().mockResolvedValue([{fullCurrencyName: 'foo', currencyCode: 'USD'}])
  // });
  // await function() { setTimeout(null, 1000); }();
  const s = await screen.getByLabelText('From this currency');
  await waitFor(() => screen.getByLabelText('From this currency'))
  expect(s.options.length).toBeGreaterThan(1);
});

test('hydrates to currencies from server', async () => {
  // const s = await screen.getByLabelText('To this currency');
  // expect(s.options.length).toBeGreaterThan(1);
})
test('displays server errors', async () => {
  // fireEvent.click(screen.getByText('Convert'));
  // await waitFor(() => screen.getByRole('error'));
  // expect(screen.getByRole('error'));
});

test('displays server results', async () => {
  // fireEvent.click(screen.getByText('Convert'));
  // const output = await waitFor(() => screen.getByRole('output'));
  // expect(output.textContent);
});

test('automatically selects a from currency', async () => {
  // const s = await screen.getByLabelText('From this currency');
  // expect(s.value);
});

//TODO: add fetch mocks