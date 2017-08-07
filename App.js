import React, { Component } from 'react';
import { Topic } from './app/native/components/explore/Topic.js';
import { TopicList } from './app/native/components/TopicList.js';
import { Delegate } from './app/native/components/delegate/Delegate.js';
import { StackNavigator } from 'react-navigation';

const MainNav = StackNavigator({
  topics: { screen: TopicList },
  topic: { screen: Topic },
  delegate: { screen: Delegate }
});

export default class App extends Component {
  render() {
    return <MainNav />;
  }
}
