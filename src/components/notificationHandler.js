import notifee, {
  TriggerType,
  AndroidImportance,
  AndroidNotificationSetting,
} from '@notifee/react-native';
import {Alert} from 'react-native';

// function to set alert notification
export async function setAlertNotification(todo) {
  const currentDate = new Date(Date.now()); // current date for comparison
  const date = new Date(Date.now());

  // set the alert date with the provided alert date
  date.setFullYear(todo.alertTime.year);
  date.setDate(todo.alertTime.day);
  date.setHours(todo.alertTime.hour);
  date.setMinutes(todo.alertTime.minute);
  date.setMonth(todo.alertTime.month);
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'todos',
    name: 'todos',
    importance: AndroidImportance.HIGH,
  });

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    alarmManager: true,
  };

  // Request permissions (required for iOS)
  await notifee.requestPermission();

  const settings = notifee.getNotificationSettings();
  // if alarm permission is granted in android
  if ((await settings).android.alarm == AndroidNotificationSetting.ENABLED) {
    //Create timestamp trigger
    if (todo.isAlertProvided && !todo.isCompleted) {
      if (date.getTime() > currentDate.getTime()) {
        // Display an alert notification
        await notifee.createTriggerNotification(
          {
            id: todo._id.toHexString(),
            title: `${
              todo.alertTime.day < 10
                ? '0' + todo.alertTime.day
                : todo.alertTime.day
            }/${
              todo.alertTime.month + 1 < 10
                ? '0' + (todo.alertTime.month + 1)
                : todo.alertTime.month + 1
            }/${todo.alertTime.year} • ${
              todo.alertTime.hour < 10
                ? '0' + todo.alertTime.hour
                : todo.alertTime.hour
            }:${
              todo.alertTime.minute < 10
                ? '0' + todo.alertTime.minute
                : todo.alertTime.minute
            } Reminder`,
            body: `<p>${todo.body}</p></b></p>`,
            subtitle: 'To-dos',

            android: {
              pressAction: {id: 'default'},
              autoCancel: false,
              groupSummary: true,
              groupId: 'all-todos',
              importance: AndroidImportance.HIGH,
              color: '#60b1d6',
              channelId,
              actions: [
                {
                  title: `<p><b>MARK AS COMPLETE ✅</span></p>`,
                  pressAction: {
                    id: 'mark-as-completed',
                  },
                },
              ],
            },
          },
          trigger,
        );
      } else {
        await notifee.cancelTriggerNotification(todo._id.toHexString());
      }
    } else {
      await notifee.cancelTriggerNotification(todo._id.toHexString());
    }
  } else {
    // Show some user information to educate them on what exact alarm permission is,
    // and why it is necessary for your app functionality, then send them to system preferences:

    Alert.alert(
      'Enable alarm',
      'You have to enable the alarm permission on your device to set alert notifications',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: await notifee.openAlarmPermissionSettings(),
        },
      ],
      {cancelable: false},
    );
  }
}

// function to clear alert notifications of deleted todos

export function deleteSelectedAlerts(arr) {
  arr.map(async item => {
    if (item.isSelected) {
      await notifee.cancelTriggerNotification(item._id.toHexString());
    }
  });
}
