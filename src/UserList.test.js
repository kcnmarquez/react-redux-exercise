import { fireEvent, waitForElementToBeRemoved, within } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserList from './UserList';
import { renderWithProviders } from './utils/test-utils';

describe('Users List', () => {
  const mockUsers = [
    {
      'id': 1,
      'name': 'John Smith',
      'email': 'jsmith@gmail.com',
      'phone': '123-456-789',
    },
    {
      'id': 2,
      'name': 'Jane Doe',
      'email': 'jane.doe.23@yahoo.com',
      'phone': '(63) 912 345 6789',
    },
  ];

  function getUsers(users) {
    return rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(users));
    });
  }

  const server = setupServer(getUsers(mockUsers))

  // Enable API mocking before tests.
  beforeAll(() => server.listen())

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers())

  // Disable API mocking after the tests are done.
  afterAll(() => server.close())

  it('should show a loader while fetching users', async () => {
    const { getByText } = renderWithProviders(<UserList />);

    const headerElement = getByText('Users');
    expect(headerElement).toBeInTheDocument();

    const loader = getByText('Loading...');
    expect(loader).toBeInTheDocument();

    // This is needed to remove the "Warning: An update to UserList inside a test was not wrapped in act(...)."
    await waitForElementToBeRemoved(() => getByText('Loading...'));
  });

  it('should show all the users', async () => {
    const { getByText, getAllByTestId } = renderWithProviders(<UserList />);

    await waitForElementToBeRemoved(() => getByText('Loading...'));

    const headerElement = getByText('Users');
    expect(headerElement).toBeInTheDocument();

    const userCards = getAllByTestId('user-card');
    expect(userCards).toHaveLength(2);
    const firstUserCard = within(userCards[0]).getByText('John Smith');
    expect(firstUserCard).toBeInTheDocument();
    const secondUserCard = within(userCards[1]).getByText('Jane Doe');
    expect(secondUserCard).toBeInTheDocument();
  });

  it('should remove user card on delete', async () => {
    const { findAllByTestId } = renderWithProviders(<UserList />);

    let userCards = await findAllByTestId('user-card');
    expect(userCards).toHaveLength(2);
    const firstUserCard = within(userCards[0]).getByText('John Smith');
    expect(firstUserCard).toBeInTheDocument();

    // delete a user
    const deleteButton = within(userCards[0]).getByText('Delete');
    fireEvent.click(deleteButton);

    userCards = await findAllByTestId('user-card');
    expect(userCards).toHaveLength(1);
    const userCard = within(userCards[0]).queryByText('John Smith');
    expect(userCard).not.toBeInTheDocument();
  });

  it('should show no users available', async () => {
    server.use(getUsers([]));

    const { getByText } = renderWithProviders(<UserList />);

    await waitForElementToBeRemoved(() => getByText('Loading...'));

    const headerElement = getByText('Users');
    expect(headerElement).toBeInTheDocument();

    const divElement = getByText('No users available');
    expect(divElement).toBeInTheDocument();
  });

  it('should show an error alert when API fails', async () => {
    server.use(
      rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) => {
        return res.once(ctx.status(500), ctx.json({ error: 'error' }));
      })
    );

    const { getByText } = renderWithProviders(<UserList />);

    await waitForElementToBeRemoved(() => getByText('Loading...'));

    const headerElement = getByText('Users');
    expect(headerElement).toBeInTheDocument();

    const errorAlert = getByText('Failed to load users. Please try again.');
    expect(errorAlert).toBeInTheDocument();
  });
});