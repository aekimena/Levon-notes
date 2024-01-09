import {createSlice} from '@reduxjs/toolkit';

// month index represented with the month
const month = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
};

// day index represented with index + 1

export const notesCollection = createSlice({
  name: 'notesCollection',
  initialState: {
    notesArray: [],
  },
  reducers: {
    addNote: (state, action) => {
      action.payload.selected = false; // add a selected key to handle select to delete
      state.notesArray = [action.payload, ...state.notesArray];
    },
    editNote: (state, action) => {
      const date = new Date(Date.now()); // get the updated date
      const newTime = `${date.getHours()}:${date.getMinutes()}, ${
        month[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;

      const updatedArray = [...state.notesArray]; // copy of the array

      // get the index of the note to update
      const updatedObjIndex = state.notesArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        title: action.payload.title,
        body: action.payload.body,
        time: newTime,
      };

      // this is for moving the edited obj to the top
      const newObj = updatedArray[updatedObjIndex];
      updatedArray.splice(updatedObjIndex, 1);
      updatedArray.unshift(newObj);

      state.notesArray = [...updatedArray];
    },
    //
    deleteNote: (state, action) => {
      state.notesArray = state.notesArray.filter(
        obj => obj.id !== action.payload.id,
      );
    },
    selectToDelete: (state, action) => {
      const updatedArray = [...state.notesArray]; // copy of the array

      // get the index of the note to update
      const updatedObjIndex = state.notesArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: !updatedArray[updatedObjIndex].selected,
      };

      state.notesArray = [...updatedArray];
    },
    selectAllTrue: (state, action) => {
      const updatedArray = [...state.notesArray];
      const updatedObjIndex = state.notesArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: true,
      };

      state.notesArray = [...updatedArray];
    },
    selectAllFalse: (state, action) => {
      const updatedArray = [...state.notesArray];
      const updatedObjIndex = state.notesArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {
        ...updatedArray[updatedObjIndex],
        selected: false,
      };

      state.notesArray = [...updatedArray];
    },
    deleteSelectedNote: (state, action) => {
      const updatedArray = [...state.notesArray];
      state.notesArray = updatedArray.filter(item => item.selected === false);
    },
    //
  },
});

export const {
  addNote,
  editNote,
  deleteNote,
  selectAllFalse,
  selectAllTrue,
  deleteSelectedNote,
  selectToDelete,
} = notesCollection.actions;
export default notesCollection.reducer;
