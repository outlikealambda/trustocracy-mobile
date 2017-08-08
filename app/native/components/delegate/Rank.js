/**
 * @flow
 */
import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import { TextButton, IconButton, Sizes } from '../Buttons.js';

import { styles } from './styles.js';
import * as Person from '../Person.js';
import * as Colors from '../../colors.js';

export const Status = {
  CLEAN: 'clean',
  DIRTY: 'dirty',
  SAVING: 'saving'
};

export type StatusType = 'clean' | 'dirty' | 'saving';

type State = {
  toggled: Object
};

type Props = {
  activeState: StatusType,
  active: Array<any>,
  move: Function,
  save: Function,
  reset: Function
};

export class Rank extends Component<void, Props, State> {
  state: State;

  constructor() {
    super();

    this.state = {
      toggled: {}
    };
  }

  toggle = (toggledIdx: number) => () => {
    const { toggled } = this.state;

    toggled[toggledIdx] = !toggled[toggledIdx];

    this.setState({ toggled });
  };

  render() {
    const { activeState, active, save, reset } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 2, justifyContent: 'flex-start' }}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.header}>Rank delegates</Text>
          </View>
          {active.map(this.renderFriend(active.length))}
        </View>
        {!isDirty(activeState)
          ? []
          : <View style={styles.saveResetRow}>
              <TextButton
                text="Save"
                buttonStyle={{
                  backgroundColor: Colors.creation,
                  marginHorizontal: 8
                }}
                onPress={save}
              />
              <TextButton
                text="Reset"
                buttonStyle={{
                  backgroundColor: Colors.destruction,
                  marginHorizontal: 8
                }}
                onPress={reset}
              />
            </View>}
      </View>
    );
  }

  moveUp = (idx: number) => () => this.props.move(idx, idx - 1);
  moveDown = (idx: number) => () => this.props.move(idx, idx + 1);
  deactivate = (idx: number) => () => this.props.move(idx);

  iconUp = (idx: number) =>
    <IconButton
      size={Sizes.SMALL}
      name="arrow-up"
      iconStyle={{ fontSize: 16, height: 16, width: 10, color: 'white' }}
      buttonStyle={{ marginVertical: 2 }}
      shape="square"
      backgroundColor={Colors.electricBlue}
      onPress={this.moveUp(idx)}
    />;

  iconDown = (idx: number) =>
    <IconButton
      size={Sizes.SMALL}
      name="arrow-down"
      iconStyle={{ fontSize: 16, height: 16, width: 10, color: 'white' }}
      buttonStyle={{ marginVertical: 2 }}
      shape="square"
      backgroundColor={Colors.orange}
      onPress={this.moveDown(idx)}
    />;

  renderFriend = (friendCount: number) => (friend: Object, idx: number) => {
    const expanded = this.state.toggled[friend.id];

    return (
      <TouchableHighlight key={friend.id} onPress={this.toggle(friend.id)}>
        <View>
          <View style={styles.row}>
            <Person.Button
              person={Object.assign({ color: '#efefef' }, friend)}
            />
            <Text style={{ flex: 1 }}>
              {friend.name}
            </Text>
            <View style={{ flex: 0 }}>
              {idx >= 1 && this.iconUp(idx)}
              {idx !== friendCount - 1 && this.iconDown(idx)}
            </View>
          </View>
          {!expanded
            ? []
            : <View
                style={[
                  styles.row,
                  {
                    backgroundColor: '#efefef',
                    paddingHorizontal: 16,
                    paddingVertical: 8
                  }
                ]}
              >
                <TextButton
                  onPress={this.deactivate(idx)}
                  size={Sizes.SMALL}
                  buttonStyle={{
                    backgroundColor: Colors.destruction,
                    marginRight: 16
                  }}
                  text="Deactivate"
                />
                <Text>
                  {friend.name}
                </Text>
              </View>}
        </View>
      </TouchableHighlight>
    );
  };
}

const isDirty = activeState => activeState === Status.DIRTY;

Rank.propTypes = {
  activeState: PropTypes.string.isRequired,
  active: PropTypes.array.isRequired,
  move: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};
