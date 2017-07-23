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
              style={styles.influence}
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
  influence: {
    marginVertical: 4
  },
  leftComponent: {
    marginRight: 8,
    minWidth: 48,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 8,
    paddingLeft: 16
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 16
  },
  text: {
    flex: 1,
    fontSize: 16
  }
});
