import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { TabNavigator } from 'react-navigation';

class Add extends Component {
  static navigationOptions = {
    tabBarLabel: 'Add'
  }

  render () {
    return <Text>Lets Add together!</Text>;
  }
}

class Pool extends Component {
  static navigationOptions = {
    tabBarLabel: 'Pool'
  }

  render () {
    return <Text>Lets Pool together!</Text>;
  }
}

class Active extends Component {
  static navigationOptions = {
    tabBarLabel: 'Active'
  }

  render () {
    return <Text> Lets Active together!</Text>;
  }
}

export const Delegate = TabNavigator({
  add: { screen: Add },
  pool: { screen: Pool },
  active: { screen: Active }
}, {
  swipeEnabled: true,
  lazy: true,
  tabBarOptions: {
    style: {
      backgroundColor: 'pink'
    },
    labelStyle: {
      fontSize: 16
    }
  }
});
