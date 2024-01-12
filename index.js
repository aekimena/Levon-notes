/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values';
import notifee, {EventType} from '@notifee/react-native';
import {useQuery, useRealm} from '@realm/react';
import {Todos} from './src/realm/todosModel';

// function to handle background notification

notifee.onBackgroundEvent(async ({type, detail}) => {
  const realm = useRealm();
  const TodosArray = useQuery(Todos);
  const item = TodosArray.find(obj => obj._id == detail.notification.id);
  if (item) {
    if (
      type === EventType.ACTION_PRESS &&
      detail.pressAction.id === 'mark-as-completed'
    ) {
      realm.write(() => {
        item.isCompleted = true;
      });
      await notifee.cancelNotification(detail.notification.id);
    }
  } else {
    await notifee.cancelNotification(detail.notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
