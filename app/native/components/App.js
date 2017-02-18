import { Topic } from './Topic.js';
import { TopicList } from './TopicList.js';
import { StackNavigator } from 'react-navigation';

export const App = StackNavigator({
  topics: { screen: TopicList },
  topic: { screen: Topic }
});
