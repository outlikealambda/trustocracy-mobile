/**
 * @flow
 */
import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import { RoundedButton, IconButton, Sizes } from '../Buttons.js';

import { styles } from './styles.js';
import * as Person from '../Person.js';
import * as Colors from '../../colors.js';

export const Status = {
  AT_REST: 'atrest',
  ACTIVATING: 'activating',
  ACTIVATED: 'activated',
  REMOVING: 'removing',
  REMOVED: 'removed'
};

export type StatusType =
  | 'activating'
  | 'activated'
  | 'removing'
  | 'removed'
  | 'atrest';

type State = {
  toggled: Object
};

type Props = {
  inactive: Array<any>,
  remove: Function,
  activate: Function
};

type InactiveFriend = {
  id: number,
  name: string,
  status: StatusType
};

export class Activate extends Component<void, Props, State> {
  state: State;

  constructor() {
    super();

    this.state = {
      toggled: {}
    };
  }

  toggle = (friendId: number) => {
    const { toggled } = this.state;

    toggled[friendId] = !toggled[friendId];

    this.setState({ toggled });
  };

  render() {
    const { inactive } = this.props;

    return (
      <View>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.header}>Activate delegates</Text>
        </View>
        <View>
          {inactive.map(this.renderInactive)}
        </View>
      </View>
    );
  }

  renderInactive = (friend: InactiveFriend) => {
    switch (friend.status) {
      case Status.ACTIVATING:
        return this.renderActivating(friend);
      case Status.ACTIVATED:
        return this.renderActivated(friend);
      case Status.REMOVING:
        return this.renderRemoving(friend);
      case Status.REMOVED:
        return this.renderRemoved(friend);
      case Status.AT_REST:
      default:
        return this.renderPooled(friend);
    }
  };

  renderActivating = Message(({ name }) => `Activating ${name}`);

  renderActivated = Message(({ name }) => `${name} is now an Active Delegate`);

  renderRemoving = Message(({ name }) => `Removing ${name}`);

  renderRemoved = Message(
    ({ name }) => `${name} has been removed from the pool`
  );

  renderPooled = (friend: InactiveFriend) => {
    const { remove, activate } = this.props;
    const expanded = this.state.toggled[friend.id];

    return (
      <TouchableHighlight
        key={friend.id}
        onPress={() => this.toggle(friend.id)}
      >
        <View>
          <View style={styles.row}>
            <Person.Button
              person={Object.assign({ color: '#efefef' }, friend)}
            />
            <Text style={{ flex: 1 }}>
              {friend.name} {expanded}
            </Text>
            <IconButton
              name="zap"
              size={Sizes.MEDIUM}
              iconStyle={[styles.icon, { width: 24 * (20 / 32) }]}
              buttonStyle={{ marginVertical: 2 }}
              backgroundColor={Colors.electricBlue}
              onPress={() => activate(friend.id)}
            />
          </View>
          {expanded &&
            <View
              style={[
                styles.row,
                {
                  backgroundColor: '#efefef',
                  paddingHorizontal: 16,
                  paddingVertical: 8
                }
              ]}
            >
              <RoundedButton
                buttonStyle={{
                  backgroundColor: 'lightyellow',
                  marginRight: 16
                }}
                text="Remove"
                onPress={() => remove(friend.id)}
              />
              <Text>
                {friend.name} from the pool
              </Text>
            </View>}
        </View>
      </TouchableHighlight>
    );
  };
}

const Message = messageBuilder => {
  // eslint wants names for all components, so we save to a const and then
  // return the const
  const wrapper = (friend: InactiveFriend) =>
    <View key={friend.id} style={[styles.row, { marginLeft: 16 }]}>
      <Text>
        {messageBuilder(friend)}
      </Text>
    </View>;

  return wrapper;
};
