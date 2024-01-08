import {createSlice} from '@reduxjs/toolkit';

export const todosCollection = createSlice({
  name: 'todosCollection',
  initialState: {
    todosArray: [],
  },
  reducers: {
    addTodo: (state, action) => {
      action.payload.selected = false; // add a selected key to handle select to delete
      state.todosArray = [...state.todosArray, action.payload];
    },
    editTodo: (state, action) => {
      const updatedArray = [...state.todosArray];
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        body: action.payload.body,
      };

      state.todosArray = [...updatedArray];
    },
    completeTodo: (state, action) => {
      const updatedArray = [...state.todosArray]; // copy of the array

      // get the index of the todo to update
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        completed: !updatedArray[updatedObjIndex].completed,
      };

      state.todosArray = [...updatedArray];
    },
    selectToDelete: (state, action) => {
      const updatedArray = [...state.todosArray]; // copy of the array

      // get the index of the todo to update
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: !updatedArray[updatedObjIndex].selected,
      };

      state.todosArray = [...updatedArray];
    },
    selectAllTrue: (state, action) => {
      const updatedArray = [...state.todosArray];
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: true,
      };

      state.todosArray = [...updatedArray];
    },
    selectAllFalse: (state, action) => {
      const updatedArray = [...state.todosArray];
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: false,
      };

      state.todosArray = [...updatedArray];
    },
    deleteSelected: (state, action) => {
      const updatedArray = [...state.todosArray];
      state.todosArray = updatedArray.filter(item => item.selected === false);
    },
  },
});

export const {
  addTodo,
  editTodo,
  completeTodo,
  selectToDelete,
  deleteSelected,
  selectAllFalse,
  selectAllTrue,
} = todosCollection.actions;
export default todosCollection.reducer;
