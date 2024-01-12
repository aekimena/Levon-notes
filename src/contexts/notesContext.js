import React, {useState} from 'react';
import {useQuery, useRealm} from '@realm/react';
import {Notes} from '../realm/notesModel';

export const NotesContext = React.createContext();

const NotesContextProvider = ({children}) => {
  const realm = useRealm();
  const NotesArray = useQuery(Notes);

  const [anyNoteItemSelected, setAnyNoteItemSelected] = useState(false); // is select mode active?

  const [showNoteModal, setShowNoteModal] = useState(false); // show or hide delete modal

  // function to set all note items selected or not
  function setAllSelectedNotesFalse() {
    setAnyNoteItemSelected(false);

    NotesArray.map(note => {
      realm.write(() => {
        note.isSelected = false;
      });
    });
  }

  return (
    <NotesContext.Provider
      value={{
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
