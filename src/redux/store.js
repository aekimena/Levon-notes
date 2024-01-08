import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './features/notescCollection';
import todosReducer from './features/todosCollection';

export default configureStore({
  reducer: {
    notesCollection: notesReducer,
    todosCollection: todosReducer,
  },
});
