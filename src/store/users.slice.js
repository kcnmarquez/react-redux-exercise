import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const name = 'users';
const initialState = {
  list: null,
  item: null,
};
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

function createExtraActions() {
  const baseUrl = 'https://jsonplaceholder.typicode.com/users';

  return {
    getAll: getAll(),
  };

  function getAll() {
    return createAsyncThunk(
      `${name}/getAll`,
      async () => {
        const response = await axios.get(baseUrl);
        return response.data;
      }
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getAll();

    function getAll() {
      const { pending, fulfilled, rejected } = extraActions.getAll;
      builder
        .addCase(pending, (state) => {
          state.list = { loading: true };
        })
        .addCase(fulfilled, (state, action) => {
          state.list = { value: action.payload };
        })
        .addCase(rejected, (state, action) => {
          state.list = { error: action.error };
        });
    }
  }
}
