import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { usersReducer } from './users.slice.js';

const rootReducer = combineReducers({
  users: usersReducer,
});

export const setupStore = preloadedState => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};
