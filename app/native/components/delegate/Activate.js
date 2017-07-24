import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import { RoundedButton, IconButton, Sizes } from '../Buttons.js';

import { styles } from './styles.js';
import * as Person from '../Person.js';
import * as Colors from '../../colors.js';

export class Activate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: {}
    };
  }

  toggle = friendId => {
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

  renderInactive = friend => {
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
  };

  renderMessage = messageBuilder => {
    return friend =>
      <View key={friend.id} style={[styles.row, { marginLeft: 16 }]}>
        <Text>
          {messageBuilder(friend)}
        </Text>
      </View>;
  };

  renderActivating = this.renderMessage(({ name }) => `Activating ${name}`);

  renderActivated = this.renderMessage(
    ({ name }) => `${name} is now an Active Delegate`
  );

  renderRemoving = this.renderMessage(({ name }) => `Removing ${name}`);

  renderRemoved = this.renderMessage(
    ({ name }) => `${name} has been removed from the pool`
  );

  renderPooled = friend => {
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

Activate.propTypes = {
  activate: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  inactive: PropTypes.array.isRequired
};
