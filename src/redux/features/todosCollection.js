import {createSlice} from '@reduxjs/toolkit';
import notifee, {TriggerType} from '@notifee/react-native';

// function to set alert notification
async function setAlertNotification(todo) {
  const currentDate = new Date(Date.now());
  const date = new Date(Date.now());

  // set the alert date with the provided alert date
  date.setFullYear(todo.alertTime.year);
  date.setDate(todo.alertTime.day);
  date.setHours(todo.alertTime.hour);
  date.setMinutes(todo.alertTime.minute);
  date.setMonth(todo.alertTime.month);

  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'todos',
    name: 'todos',
  });

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  if (todo.alertProvided) {
    if (date.getTime() > currentDate.getTime()) {
      // Display an alert notification
      await notifee.createTriggerNotification(
        {
          id: todo.id,
          title: `To-dos: ${todo.body}`,

          android: {
            channelId,
            actions: [
              {
                title: 'Mark as completed',
                pressAction: {
                  id: 'mark-as-complete',
                },
              },
              {
                title: 'Ignore',
                pressAction: {
                  id: 'ignore',
                },
              },
            ],
          },
        },
        trigger,
      );
    } else {
      null;
    }
  } else {
    cancelAlert(todo);
  }
}

//function to cancel alert notification

async function cancelAlert(todo) {
  const date = new Date(Date.now());
  const currentDate = new Date(Date.now());
  // set the alert date with the provided alert date
  date.setFullYear(todo.alertTime.year);
  date.setDate(todo.alertTime.day);
  date.setHours(todo.alertTime.hour);
  date.setMinutes(todo.alertTime.minute);
  date.setMonth(todo.alertTime.month);
  if (todo.alertProvided) {
    if (todo.completed) {
      await notifee.cancelTriggerNotification(todo.id);
    } else {
      if (date.getTime() > currentDate.getTime()) {
        setAlertNotification(todo);
      } else {
        null;
      }
    }
  } else {
    await notifee.cancelTriggerNotification(todo.id);
  }
}

// function to check if the alert time has been updated by user

function checkForAlertEdit(todo) {
  if (todo.alertProvided) {
    setAlertNotification(todo);
  } else {
    cancelAlert(todo);
  }
}

export const todosCollection = createSlice({
  name: 'todosCollection',
  initialState: {
    todosArray: [],
  },
  reducers: {
    addTodo: (state, action) => {
      action.payload.selected = false; // add a selected key to handle select to delete
      action.payload.alertProvided
        ? setAlertNotification(action.payload)
        : null;
      state.todosArray = [...state.todosArray, action.payload];
    },
    editTodo: (state, action) => {
      const updatedArray = [...state.todosArray];
      const updatedObjIndex = state.todosArray.findIndex(
        obj => obj.id == action.payload.id,
      );

      updatedArray[updatedObjIndex] = {...action.payload};

      state.todosArray = [...updatedArray];

      checkForAlertEdit(state.todosArray[updatedObjIndex]);
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

      cancelAlert(state.todosArray[updatedObjIndex]);
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
