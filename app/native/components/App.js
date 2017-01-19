import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { Topic } from './Topic.js';
import { TopicList } from './TopicList.js';

export class App extends Component {
  render () {
    return (
      <Router>
        <Scene key='root'>
          <Scene key='topic' title='Topic' component={Topic} />
          <Scene key='topics' title='Topics' component={TopicList} initial />
        </Scene>
      </Router>
    );
    /*
    const routes = [
       { title: 'TopicsList' }
    ];

    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        renderScene={(route, navigator) =>
          <TouchableHighlight onPress={() => {
            if (route.index === 0) {
              navigator.push(routes[1]);
            } else {
              navigator.pop();
            }
          }}>
          <Text>Hello {route.title}!</Text>
          </TouchableHighlight>
        }
        style={{padding: 100}}
      />
    );
    */
  }
}
