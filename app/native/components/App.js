import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { Topic } from './Topic.js';
import { TopicList } from './TopicList.js';

export class App extends Component {
  render () {
    return <Router>
      <Scene key='root'>
        <Scene key='topic' component={Topic} />
        <Scene key='topics' component={TopicList} initial hideNavBar />
      </Scene>
    </Router>;
  }
}
