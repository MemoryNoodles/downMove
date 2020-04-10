/**
 * @format
 */

import {AppRegistry} from 'react-native';
import PlayMove from './app/playMove';
import APP from './app/App';
//  import Test from './test';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => PlayMove);
