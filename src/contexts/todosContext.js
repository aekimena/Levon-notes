import React, {useState, useRef, useEffect} from 'react';

import {useQuery, useRealm} from '@realm/react';
import {Todos} from '../realm/todosModel';

export const TodosContext = React.createContext();

const TodosContextProvider = ({children}) => {
  const realm = useRealm();
  const TodosArray = useQuery(Todos);

  const [anyTodoItemSelected, setAnyTodoItemSelected] = useState(false); // is select mode active?
  const [addBoxShown, setAddBoxShown] = useState(false); // show or hide add new todo modal

  const [showTodoModal, setShowTodoModal] = useState(false); // show or hide todo delete modal

  // function to set all todo items selected or not
  function setAllSelectedTodosFalse() {
    setAnyTodoItemSelected(false);
    TodosArray.map(todo => {
      realm.write(() => {
        todo.isSelected = false;
      });
    });
  }

  return (
    <TodosContext.Provider
      value={{
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
