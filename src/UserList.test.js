import { render, screen } from '@testing-library/react';
import UserList from './UserList';

test('renders users list', () => {
  render(<UserList />);
  const linkElement = screen.getByText(/Users/i);
  expect(linkElement).toBeInTheDocument();
});
