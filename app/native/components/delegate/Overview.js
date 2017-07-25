/**
 * @flow
 */
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles.js';

type OverviewProps = {
  activeCount: number,
  inactiveCount: number,
  add: Function,
  activate: Function,
  rank: Function
};

export class Overview extends Component<void, OverviewProps, void> {
  render() {
    const { activeCount, inactiveCount, add, activate, rank } = this.props;

    return (
      <View style={{ flex: 1, marginLeft: 32 }}>
        <View style={[styles.row, { marginTop: 32 }]}>
          <Text>You have</Text>
          <Text style={styles.bigNumber}>
            {activeCount}
          </Text>
          <Text>active delegates</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.overviewButton}>
            {rank}
          </View>
          <Text>Rank active delegates</Text>
        </View>
        <View style={[styles.row, { marginTop: 32 }]}>
          <Text>You have</Text>
          <Text style={styles.bigNumber}>
            {inactiveCount}
          </Text>
          <Text>inactive delegates</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.overviewButton}>
            {add}
          </View>
          <Text>Add more delegates</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.overviewButton}>
            {activate}
          </View>
          <Text>Activate delegates</Text>
        </View>
      </View>
    );
  }
}
