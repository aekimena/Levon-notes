import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllFalse} from '../redux/features/notescCollection';

export const NotesContext = React.createContext();

const NotesContextProvider = ({children}) => {
  const notes = useSelector(state => state.notesCollection.notesArray);
  const dispatch = useDispatch();

  const [isNoteItemSelected, setIsNoteItemSelected] = useState(false);

  const [anyNoteItemSelected, setAnyNoteItemSelected] = useState(false);

  const [showNoteModal, setShowNoteModal] = useState(false);

  function setAllSelectedNotesFalse() {
    setIsNoteItemSelected(false);
    setAnyNoteItemSelected(false);
    notes.map(note => {
      dispatch(selectAllFalse(note));
    });
  }

  return (
    <NotesContext.Provider
      value={{
        isNoteItemSelected,
        setIsNoteItemSelected,
        anyNoteItemSelected,
        setAnyNoteItemSelected,
        setAllSelectedNotesFalse,
        showNoteModal,
        setShowNoteModal,
      }}>
      {children}
    </NotesContext.Provider>
  );
};

export default NotesContextProvider;
