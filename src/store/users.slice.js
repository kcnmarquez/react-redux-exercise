import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const API_URL = 'https://jsonplaceholder.typicode.com/users';

function createExtraActions() {

  return {
    getAll: getAll(),
    remove: createAction(`${name}/remove`),
  };

  function getAll() {
    return createAsyncThunk(
      `${name}/getAll`,
      async () => {
        const response = await axios.get(API_URL);
        return response.data;
      }
    );
  }
}

function createExtraReducers() {
  return (builder) => {
    getAll();
    remove();

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

    function remove() {
      builder.addCase(extraActions.remove, (state, action) => {
        const newList = state.list.value.filter(user => user.id !== action.payload);
        state.list = { value: newList };
      });
    }
  }
}
