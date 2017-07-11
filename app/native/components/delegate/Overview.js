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

export class Overview extends Component {
  render () {
    const {inactiveCount, activeCount, goAdd, goActivate, goRank} = this.props;

    return (
      <View style={{flex: 1}}>
        <View style={styles.row}>
          <Text>You have {inactiveCount} inactive delegates</Text>
        </View>
        <View style={styles.row}>
          <RoundedButton
            text='Add'
            onPress={goAdd} />
          <Text>more delegates</Text>
        </View>
        <View style={styles.row}>
          <RoundedButton
            text='Activate'
            onPress={goActivate} />
          <Text>delegates</Text>
        </View>
        <View style={styles.row}>
          <Text>You have {activeCount} active delegates</Text>
        </View>
        <View style={styles.row}>
          <RoundedButton
            text='Rank'
            onPress={goRank} />
          <Text>active delegates</Text>
        </View>
      </View>
    );
  }
}
