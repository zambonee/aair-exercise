import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

beforeEach(() => {
  render(<App />); //TODO: handle the `Can't perform a React state update on an unmounted component` warning
})

test('renders heading text', async () => {
  expect(await screen.findByText("Currency Converter"));
});

test('hydrates from currencies from server', async () => {
  await waitFor(async () => {
    const s = await screen.getByLabelText('From this currency');
    expect(s.options.length).toBeGreaterThan(1);
  });
});

test('hydrates to currencies from server', async () => {
  await waitFor(async () => {
    const s = await screen.getByLabelText('To this currency');
    expect(s.options.length).toBeGreaterThan(1);
  });
});

test('displays server errors', async () => {
  await waitFor(async () => {
    act(() => { fireEvent.click(screen.getByText('Convert')); });
    await waitFor(() => expect(screen.getByRole('alert')));
  });
});

test('displays server results', async () => {
  await waitFor(() => expect(screen.getAllByText('United States Dollars (USD)')));
  act(async () => {
    await waitFor(() => fireEvent.change(screen.getByLabelText('Amount:'), {target: { value: '722.5' }}));
    await waitFor(() => fireEvent.change(screen.getByLabelText('From this currency'), {target: { selectedIndex: 1 }}));
    await waitFor(() => fireEvent.change(screen.getByLabelText('To this currency'), {target: { selectedIndex: 2 }}));
    fireEvent.click(screen.getByText('Convert')); 
  });
  const output = await waitFor(() => screen.getByRole('status'));
  expect(output.textContent);
});

test('automatically selects a from currency', async () => {
  await waitFor(async () => {
    const s = await screen.getByLabelText('From this currency');
    expect(s.value).toBe('USD');
  });
});
