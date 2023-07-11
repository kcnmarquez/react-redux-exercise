import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from './users.slice';

export default configureStore({
  reducer: {
    users: usersReducer,
  },
});
