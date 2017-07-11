import React, { Component } from 'react';
import {
  LayoutAnimation,
  Text,
  TextInput,
  View
} from 'react-native';

import { styles } from './styles.js';

export class Add extends Component {
  constructor (props) {
    super(props);

    this.state = {
      inputEmail: null
    };
  }

  findAndClear = email => {
    this.props.search(email)
      .then(() => {
        this.setState({inputEmail: null});
      });
  }

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  }

  updateInput = inputEmail => this.setState({ inputEmail })

  render () {
    const {recentlyAdded, recentlyFailed} = this.props;

    return (
      <View>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.header}>Add to your pool of friends</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={{marginLeft: 8, color: '#666'}}>Search by email</Text>
          <TextInput
            value={this.state.inputEmail}
            style={styles.textInput}
            multiline={false}
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='jimbo@jimbo.com'
            returnKeyType='search'
            onChangeText={this.updateInput}
            onSubmitEditing={event => this.findAndClear(event.nativeEvent.text)}
            />
        </View>
        <View style={[styles.row]}>
          {recentlyAdded.map(this.renderRecentlyAdded)}
        </View>
        <View style={[styles.row]}>
          {recentlyFailed.map(this.renderRecentlyFailed)}
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
