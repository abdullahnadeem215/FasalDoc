/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { runBackgroundAlertCheck } from './src/services/backgroundTaskService';

AppRegistry.registerComponent(appName, () => App);

// Register headless task for background fetch
const MyHeadlessTask = async (event) => {
  console.log('[BackgroundFetch HeadlessTask] start');
  const taskId = event.taskId;
  const isTimeout = event.timeout;
  if (isTimeout) {
    console.log('[BackgroundFetch] HeadlessTask TIMEOUT:', taskId);
    BackgroundFetch.finish(taskId);
    return;
  }

  await runBackgroundAlertCheck();
  BackgroundFetch.finish(taskId);
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
