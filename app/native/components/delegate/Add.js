import React, { Component } from 'react';
import { LayoutAnimation, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from './styles.js';

export class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputEmail: null
    };
  }

  findAndClear = email => {
    this.props.search(email).then(() => {
      this.setState({ inputEmail: null });
    });
  };

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  };

  updateInput = inputEmail => this.setState({ inputEmail });

  render() {
    const { recentlyAdded, recentlyFailed, delegateCount } = this.props;

    return (
      <View>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.header}>
            Add {delegateCount > 0 ? 'another' : 'a'} delegate
          </Text>
        </View>
        <View style={[styles.row]}>
          <Text style={{ marginLeft: 8, color: '#666' }}>Search by email</Text>
          <TextInput
            value={this.state.inputEmail}
            style={styles.textInput}
            multiline={false}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="jimbo@jimbo.com"
            returnKeyType="search"
            onChangeText={this.updateInput}
            onSubmitEditing={event => this.findAndClear(event.nativeEvent.text)}
          />
        </View>
        {recentlyAdded.map(this.renderRecentlyAdded)}
        {recentlyFailed.map(this.renderRecentlyFailed)}
      </View>
    );
  }

  renderRecentlyAdded = email => {
    return (
      <View key={email} style={styles.row}>
        <Text style={{ color: 'green' }} key={email}>
          Success! We found {email}
        </Text>
      </View>
    );
  };

  renderRecentlyFailed = email => {
    return (
      <View key={email} style={styles.row}>
        <Text style={{ color: 'darkorange' }} key={email}>
          Sorry, we could not locate anyone with the registered email: {email}
        </Text>
      </View>
    );
  };
}

Add.propTypes = {
  recentlyAdded: PropTypes.array.isRequired,
  recentlyFailed: PropTypes.array.isRequired,
  delegateCount: PropTypes.number.isRequired,
  search: PropTypes.func.isRequired
};
