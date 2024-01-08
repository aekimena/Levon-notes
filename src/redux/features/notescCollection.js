import {createSlice} from '@reduxjs/toolkit';

// month index represented with the month
const month = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
};

// day index represented with index + 1
const day = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
};

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
      } ${day[date.getDay()]}, ${date.getFullYear()}`;

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
      // state.notesArray = [
      //   state.notesArray[updatedObjIndex],
      //   ...state.notesArray.slice(0, updatedObjIndex),
      //   ...state.notesArray.slice(updatedObjIndex + 1),
      // ];
    },
    deleteNote: (state, action) => {
      state.notesArray = state.notesArray.filter(note => {
        note.id !== action.payload.id;
      });
    },
  },
});

export const {addNote, deleteNote, editNote} = notesCollection.actions;
export default notesCollection.reducer;
