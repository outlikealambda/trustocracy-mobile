import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import { InitialsButton, RoundedButton, IconButton } from '../Buttons.js';

import { styles } from './styles.js';
import { Persons } from '../../utils.js';
import * as Colors from '../../colors.js';

export class Rank extends Component {
  constructor (props) {
    super(props);

    this.state = {
      toggled: {}
    };
  }

  toggle = toggledIdx => () => {
    const {toggled} = this.state;

    toggled[toggledIdx] = !toggled[toggledIdx];

    this.setState({ toggled });
  }

  isDirty = () => this.props.activeState === 'dirty'

  render () {
    const {active, save, reset} = this.props;

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 2, justifyContent: 'flex-start'}}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.header}>Rank your delegates</Text>
          </View>
          {active.map(this.renderFriend(active.length))}
        </View>
        { !this.isDirty()
          ? []
          : (
            <View style={styles.saveResetRow}>
              <RoundedButton
                text='Save'
                buttonStyle={{backgroundColor: Colors.lightGreen, marginHorizontal: 8}}
                onPress={save}
                />
              <RoundedButton
                text='Reset'
                buttonStyle={{backgroundColor: Colors.lightRed, marginHorizontal: 8}}
                onPress={reset}
                />
            </View>
          )
        }
      </View>
    );
  }

  moveUp = idx => () => this.props.move(idx, idx - 1)
  moveDown = idx => () => this.props.move(idx, idx + 1)
  deactivate = idx => () => this.props.move(idx)

  iconUp = idx => (
    <IconButton
      isSmall='true'
      name='arrow-up'
      iconStyle={{fontSize: 16, height: 16, width: 10, color: 'white'}}
      buttonStyle={{marginVertical: 2}}
      shape='square'
      backgroundColor={Colors.electricBlue}
      onPress={this.moveUp(idx)}
      />
  )

  iconDown = idx => (
    <IconButton
      isSmall='true'
      name='arrow-down'
      iconStyle={{fontSize: 16, height: 16, width: 10, color: 'white'}}
      buttonStyle={{marginVertical: 2}}
      shape='square'
      backgroundColor={Colors.orange}
      onPress={this.moveDown(idx)}
      />
  )

  renderFriend = friendCount => (friend, idx) => {
    const expanded = this.state.toggled[friend.id];

    return (
      <TouchableHighlight
        key={friend.id}
        onPress={this.toggle(friend.id)}>
        <View>
          <View
            style={styles.row}>
            <InitialsButton
              shape='circle'
              backgroundColor='#efefef'
              initials={Persons.initials(friend)}
              />
            <Text style={{flex: 1}}>{friend.name}</Text>
            <View style={{flex: 0}}>
              { idx < 1 ? [] : this.iconUp(idx) }
              { idx === friendCount - 1 ? [] : this.iconDown(idx) }
            </View>
          </View>
          { !expanded
            ? []
            : (
              <View style={[
                styles.row,
                {
                  backgroundColor: '#efefef',
                  paddingHorizontal: 16,
                  paddingVertical: 8
                }]}>
                <RoundedButton
                  onPress={this.deactivate(idx)}
                  buttonStyle={{backgroundColor: 'red', marginRight: 16}}
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
