import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Influence from '../Influence.js';

export class TopicInfo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.leftComponent}>
            <Influence
              influence={this.props.influence}
              style={{ paddingVertical: 4 }}
              fontSize={20}
            />
          </View>
          <InfoText>points allocated</InfoText>
        </View>
        <View style={styles.row}>
          <View style={styles.leftComponent}>
            {this.props.delegate}
          </View>
          <InfoText>wields your points</InfoText>
        </View>
      </View>
    );
  }
}

class InfoText extends Component {
  render() {
    return (
      <Text style={styles.text}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  leftComponent: {
    marginHorizontal: 16,
    width: 48,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 32,
    paddingHorizontal: 16
  },
  text: {
    fontSize: 16
  }
});
