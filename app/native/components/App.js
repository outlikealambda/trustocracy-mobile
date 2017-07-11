import { Topic } from './explore/Topic.js';
import { TopicList } from './TopicList.js';
import { Delegate } from './delegate/Delegate.js';
import { StackNavigator } from 'react-navigation';

export const App = StackNavigator({
  topics: { screen: TopicList },
  topic: { screen: Topic },
  delegate: { screen: Delegate }
});
