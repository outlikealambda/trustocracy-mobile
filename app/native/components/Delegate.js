import React, { Component } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import * as Api from './api.js';
import { InitialsButton, IconButton, RoundedButton } from './Buttons.js';
import * as Utils from '../utils.js';
import * as Colors from '../colors.js';

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

  constructor (props) {
    super(props);

    this.state = {
      isUpdating: true,
      friends: [],
      lastSaved: [],
      userId: 2
    };

    Api.friends.get(this.state.userId)
      .then(response => response.json())
      .then(friends => this.setState({
        isUpdating: false,
        friends,
        lastSaved: friends
      }));
  }

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  }

  fetchFriends () {
    this.setState({ isUpdating: true });

    return Api.friends.get(this.state.userId)
      .then(response => response.json())
      .then(friends => {
        this.setState({
          isUpdating: false,
          friends,
          lastSaved: friends
        });
      });
  }

  reset = () => {
    const lastSaved = this.state.lastSaved;

    this.animateStateChange({
      friends: lastSaved
    });
  }

  moveIt = (idxOld, idxNew) => () => {
    const friend = this.state.friends[idxOld];
    let shuffledFriends = Utils.array.remove(this.state.friends, idxOld);

    if (idxNew === shuffledFriends.length) {
      // shuffled to the end, append
      shuffledFriends.push(friend);
    } else if (idxNew || idxNew === 0) {
      // insert at new position
      shuffledFriends = Utils.array.insert(shuffledFriends, idxNew, friend);
    }

    this.animateStateChange({ friends: shuffledFriends });
  }

  render () {
    return (
      <View style={styles.column}>
        <View style={{flex: 2, justifyContent: 'flex-start'}}>
          {this.state.friends.map(this.renderFriend(this.state.friends.length), this)}
        </View>
        <View style={styles.saveResetRow}>
          <RoundedButton
            text='Reset'
            style={{backgroundColor: Colors.lightRed, marginHorizontal: 8}}
            onPress={this.reset}
            />
          <RoundedButton
            text='Save'
            style={{backgroundColor: Colors.lightGreen, marginHorizontal: 8}}
            />
        </View>
      </View>
    );
  }

  renderFriend = friendCount => (friend, idx) => {
    const moveUp = this.moveIt(idx, idx - 1);
    const moveDown = this.moveIt(idx, idx + 1);

    return (
      <TouchableHighlight
        key={friend.id}
        onPress={() => { friend.expanded = !friend.expanded; }}>
        <View
          style={styles.initialsRow}>
          <InitialsButton
            shape='circle'
            backgroundColor='#efefef'
            initials={Utils.initials(friend)}
            />
          <Text style={{flex: 1}}>{friend.name}</Text>
          <View style={{flex: 0}}>
            { idx < 1 ? []
              : <IconButton
                isSmall='true'
                name='arrow-up'
                iconStyle={{fontSize: 16, height: 16, width: 10, color: 'white'}}
                buttonStyle={{marginVertical: 2}}
                shape='square'
                backgroundColor={Colors.lightGreen}
                onPress={moveUp}
                />
            }
            { idx === friendCount - 1 ? []
              : <IconButton
                isSmall='true'
                name='arrow-down'
                iconStyle={{fontSize: 16, height: 16, width: 10, color: 'white'}}
                buttonStyle={{marginVertical: 2}}
                shape='square'
                backgroundColor={Colors.lightRed}
                onPress={moveDown}
                />
            }
          </View>
        </View>
      </TouchableHighlight>
    );
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
    showIcon: false,
    activeBackgroundColor: 'blue',
    style: {
      backgroundColor: 'pink'
    },
    labelStyle: {
      fontSize: 16
    }
  }
});

const styles = StyleSheet.create({
  column: {
    flex: 1,
    justifyContent: 'space-between'
  },
  initialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  saveResetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    flex: 0
  }
});
