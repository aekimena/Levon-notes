import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllFalse} from '../redux/features/todosCollection';

export const TodosContext = React.createContext();

const TodosContextProvider = ({children}) => {
  const todos = useSelector(state => state.todosCollection.todosArray);
  const dispatch = useDispatch();

  const [isTodoItemSelected, setIsTodoItemSelected] = useState(false);

  const [anyTodoItemSelected, setAnyTodoItemSelected] = useState(false);
  const [addBoxShown, setAddBoxShown] = useState(false);

  const [showTodoModal, setShowTodoModal] = useState(false);

  function setAllSelectedTodosFalse() {
    setIsTodoItemSelected(false);
    setAnyTodoItemSelected(false);
    todos.map(todo => {
      dispatch(selectAllFalse(todo));
    });
  }

  return (
    <TodosContext.Provider
      value={{
        isTodoItemSelected,
        setIsTodoItemSelected,
        anyTodoItemSelected,
        setAnyTodoItemSelected,
        setAllSelectedTodosFalse,
        addBoxShown,
        setAddBoxShown,
        showTodoModal,
        setShowTodoModal,
      }}>
      {children}
    </TodosContext.Provider>
  );
};

export default TodosContextProvider;
