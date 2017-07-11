import React, { Component } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Octicons';
import * as Api from './api.js';
import { InitialsButton, IconButton, RoundedButton } from './Buttons.js';
import { Arrays, Log, Persons } from '../utils.js';
import * as Colors from '../colors.js';

const USER_ID = 2;

class Add extends Component {
  static navigationOptions = {
    tabBarLabel: 'Add'
  }

  constructor (props) {
    super(props);

    this.state = {
      inputEmail: null,
      recentlyAdded: [],
      recentlyFailed: [],
      userId: USER_ID
    };
  }

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  }

  search = email => {
    Api.pool.add(this.state.userId, email)
      .then(response => {
        if (response.status !== 200) {
          this.animateStateChange({
            recentlyFailed: this.state.recentlyFailed.concat([email])
          });
        } else {
          this.animateStateChange({
            recentlyAdded: this.state.recentlyAdded.concat([email])
          });
        }
      });

    this.setState({inputEmail: null});
  }

  updateInput = inputEmail => this.setState({ inputEmail })

  render () {
    return (
      <View>
        <View style={[addStyle.row, addStyle.headerRow]}>
          <Text style={addStyle.header}>Add to your pool of friends</Text>
        </View>
        <View style={[addStyle.row]}>
          <Text style={{marginLeft: 8, color: '#666'}}>Search by email</Text>
          <TextInput
            value={this.state.inputEmail}
            style={addStyle.textInput}
            multiline={false}
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='jimbo@jimbo.com'
            returnKeyType='search'
            onChangeText={this.updateInput}
            onSubmitEditing={event => this.search(event.nativeEvent.text)}
            />
        </View>
        <View style={[addStyle.row]}>
          {this.state.recentlyAdded.map(this.renderRecentlyAdded)}
        </View>
        <View style={[addStyle.row]}>
          {this.state.recentlyFailed.map(this.renderRecentlyFailed)}
        </View>
      </View>
    );
  }

  renderRecentlyAdded = email => {
    return (
      <Text
        style={{color: 'green'}}
        key={email}>
        Successfully added {email}
      </Text>
    );
  }

  renderRecentlyFailed = email => {
    return (
      <Text
        style={{color: 'darkorange'}}
        key={email}>
        Could not locate {email}
      </Text>
    );
  }
}

class Pool extends Component {
  static navigationOptions = {
    tabBarLabel: 'Pool'
  }

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  }

  constructor (props) {
    super(props);

    this.state = {
      userId: USER_ID,
      pool: []
    };

    this.fetchPooled();
  }

  fetchPooled = () => {
    Api.pool.get(USER_ID)
      .then(response => response.json())
      .then(Log.promise('fetched pooled'))
      .then(pool => {
        this.animateStateChange({ pool });
      });
  }

  toggleOpen = friendId => {
    const pool = this.state.pool.map(f => Object.assign({}, f, {
      expanded: f.id === friendId ? !f.expanded : f.expanded
    }));

    this.animateStateChange({ pool });
  }

  updateStatus = (friendId, newStatus) => {
    const pool = this.state.pool.map(f => Object.assign({}, f, {
      status: f.id === friendId ? newStatus : f.status
    }));

    this.animateStateChange({ pool });
  }

  activate = friendId => {
    this.updateStatus(friendId, 'activating');

    Api.pool.promote(this.state.userId, friendId)
      .then(result => {
        if (result.status !== 200) {
          this.updateStatus(friendId, null);
        } else {
          this.updateStatus(friendId, 'activated');
          this.delayedHide(friendId);
        }
      });
  }

  remove = friendId => {
    this.updateStatus(friendId, 'removing');

    Api.pool.remove(this.state.userId, friendId)
      .then(result => {
        if (result.status !== 200) {
          this.updateStatus(friendId, null);
        } else {
          this.updateStatus(friendId, 'removed');
          this.delayedHide(friendId);
        }
      });
  }

  delayedHide = friendId => {
    setTimeout(() => {
      this.animateStateChange({
        pool: Arrays.removeWhere(this.state.pool, p => p.id === friendId)
      });
    }, 5000);
  }

  render () {
    return (
      <View>
        <View style={[addStyle.row, addStyle.headerRow]}>
          <Text style={addStyle.header}>Activate new delegates</Text>
        </View>
        <View>
          {this.state.pool.map(this.renderFriend)}
        </View>
      </View>
    );
  }

  renderFriend = (friend, idx) => {
    switch (friend.status) {
      case 'activating':
        return this.renderActivating(friend);
      case 'activated':
        return this.renderActivated(friend);
      case 'removing':
        return this.renderRemoving(friend);
      case 'removed':
        return this.renderRemoved(friend);
      default:
        return this.renderPooled(friend);
    }
  }

  renderMessage = messageBuilder => {
    return friend => (
      <View
        key={friend.id}
        style={[activeStyle.initialsRow, {marginLeft: 16}]}>
        <Text>{messageBuilder(friend)}</Text>
      </View>
    );
  }

  renderActivating = this.renderMessage(
    ({name}) => `Activating ${name}`
  )

  renderActivated = this.renderMessage(
    ({name}) => `${name} is now an Active Delegate`
  )

  renderRemoving = this.renderMessage(
    ({name}) => `Removing ${name}`
  )

  renderRemoved = this.renderMessage(
    ({name}) => `${name} has been removed from the pool`
  )

  renderPooled = friend => {
    return (
      <TouchableHighlight
        key={friend.id}
        onPress={() => this.toggleOpen(friend.id)}>
        <View>
          <View style={activeStyle.initialsRow}>
            <InitialsButton
              shape='circle'
              backgroundColor='#efefef'
              initials={Persons.initials(friend)}
              />
            <Text style={{flex: 1}}>{friend.name} {friend.expanded}</Text>
            <IconButton
              isSmall='true'
              name='zap'
              iconStyle={{fontSize: 16, height: 16, width: 10, color: 'white'}}
              buttonStyle={{marginVertical: 2}}
              shape='square'
              backgroundColor={Colors.lightGreen}
              onPress={() => this.activate(friend.id)}
              />
          </View>
          { !friend.expanded
            ? []
            : (
              <View style={[activeStyle.initialsRow, {backgroundColor: '#efefef', paddingHorizontal: 16, paddingVertical: 8}]}>
                <RoundedButton
                  buttonStyle={{backgroundColor: 'lightyellow', marginRight: 16}}
                  text='Remove'
                  onPress={() => this.remove(friend.id)}
                  />
                <Text>{friend.name} from the pool</Text>
              </View>
            )
          }
        </View>
      </TouchableHighlight>
    );
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
      isModified: false,
      userId: USER_ID
    };

    Api.friends.get(this.state.userId)
      .then(response => response.json())
      .then(friends => friends.map(f => Object.assign(f, {expanded: false})))
      .then(friends => {
        friends.sort((a, b) => a.rank - b.rank);
        return friends;
      })
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

  reset = () => {
    const lastSaved = this.state.lastSaved;

    this.animateStateChange({
      friends: lastSaved,
      isModified: false
    });
  }

  saveMe = () => {
    this.setState({
      status: 'saving'
    });

    const friends = this.state.friends;

    Api.friends.rank(this.state.userId, friends)
      .then(res => {
        this.setState({
          lastSaved: friends,
          isModified: false,
          status: null
        });
      });
  }

  moveIt = (idxOld, idxNew) => {
    const friend = this.state.friends[idxOld];
    let shuffledFriends = Arrays.remove(this.state.friends, idxOld);

    if (idxNew === shuffledFriends.length) {
      // shuffled to the end, append
      shuffledFriends.push(friend);
    } else if (idxNew || idxNew === 0) {
      // insert at new position
      shuffledFriends = Arrays.insert(shuffledFriends, idxNew, friend);
    }

    this.animateStateChange({ friends: shuffledFriends, isModified: true });
  }

  toggleOpen = toggledIdx => {
    const friends = this.state.friends.map((f, idx) => {
      if (idx === toggledIdx) {
        f.expanded = !f.expanded;
      } else {
        f.expanded = false;
      }

      return f;
    });

    this.animateStateChange({ friends });
  }

  isModified = () => {
    return this.state.isModified;
  }

  render () {
    return (
      <View style={activeStyle.column}>
        <View style={{flex: 2, justifyContent: 'flex-start'}}>
          <View style={[addStyle.row, addStyle.headerRow]}>
            <Text style={addStyle.header}>Rank your delegates</Text>
          </View>
          <View>
            {this.state.friends.map(this.renderFriend(this.state.friends.length), this)}
          </View>
        </View>
        { !this.isModified()
          ? []
          : (
            <View style={activeStyle.saveResetRow}>
              <RoundedButton
                text='Save'
                buttonStyle={{backgroundColor: Colors.lightGreen, marginHorizontal: 8}}
                onPress={this.saveMe}
                />
              <RoundedButton
                text='Reset'
                buttonStyle={{backgroundColor: Colors.lightRed, marginHorizontal: 8}}
                onPress={this.reset}
                />
            </View>
          )
        }
      </View>
    );
  }

  renderFriend = friendCount => (friend, idx) => {
    const moveUp = () => this.moveIt(idx, idx - 1);
    const moveDown = () => this.moveIt(idx, idx + 1);
    const deactivate = () => this.moveIt(idx);
    const toggle = () => this.toggleOpen(idx);

    return (
      <TouchableHighlight
        key={friend.id}
        onPress={toggle}>
        <View>
          <View
            style={activeStyle.initialsRow}>
            <InitialsButton
              shape='circle'
              backgroundColor='#efefef'
              initials={Persons.initials(friend)}
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
          { !friend.expanded
            ? []
            : (
              <View style={[activeStyle.initialsRow, {backgroundColor: '#efefef', paddingHorizontal: 16, paddingVertical: 8}]}>
                <RoundedButton
                  onPress={deactivate}
                  buttonStyle={{backgroundColor: 'lightyellow', marginRight: 16}}
                  text='Deactivate' />
                <Text>{friend.name}</Text>
              </View>
            )
          }
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

export const DelegateIcon = navigate => (
  <TouchableHighlight onPress={() => navigate('delegate')}>
    <Icon
      name='organization'
      size={32}
      style={{marginRight: 12}} />
  </TouchableHighlight>
);

const addStyle = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  row: {
    marginVertical: 8,
    paddingHorizontal: 16
  },
  headerRow: {
    alignItems: 'center',
    marginVertical: 16
  },
  inputRow: {
  },
  textInput: {
    paddingHorizontal: 8,
    marginTop: 8,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1
  }
});

const activeStyle = StyleSheet.create({
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
    justifyContent: 'space-around',
    marginBottom: 16,
    flex: 0
  }
});
