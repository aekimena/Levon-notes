import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllFalse} from '../redux/features/todosCollection';

export const GeneralContext = React.createContext();

const GeneralContextProvider = ({children}) => {
  const todos = useSelector(state => state.todosCollection.todosArray);
  const dispatch = useDispatch();

  const [isNoteItemSelected, setIsNoteItemSelected] = useState(false);
  const [isTodoItemSelected, setIsTodoItemSelected] = useState(false);
  const [anyNoteItemSelected, setAnyNoteItemSelected] = useState(false);
  const [anyTodoItemSelected, setAnyTodoItemSelected] = useState(false);

  function setAllSelectedTodosFalse() {
    setIsTodoItemSelected(false);
    setAnyTodoItemSelected(false);
    todos.map(todo => {
      dispatch(selectAllFalse(todo));
    });
  }

  return (
    <GeneralContext.Provider
      value={{
        isNoteItemSelected,
        setIsNoteItemSelected,
        isTodoItemSelected,
        setIsTodoItemSelected,
        anyNoteItemSelected,
        setAnyNoteItemSelected,
        anyTodoItemSelected,
        setAnyTodoItemSelected,
        setAllSelectedTodosFalse,
      }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
