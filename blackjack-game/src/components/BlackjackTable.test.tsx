import React from 'react';
import { render, screen } from '@testing-library/react';
import BlackjackTable from './BlackjackTable';

test('renders BlackjackTable component', () => {
  render(<BlackjackTable />);
  const linkElement = screen.getByText(/blackjack table/i);
  expect(linkElement).toBeInTheDocument();
});