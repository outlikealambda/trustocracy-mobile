import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Influence from './Influence.js';

export class TopicInfo extends Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <InfoText>You wield</InfoText>
          <View style={styles.inlineComponent}>
            <Influence
              influence={this.props.influence}
              style={{paddingVertical: 4}}
              fontSize={20} />
          </View>
          <InfoText>influence</InfoText>
        </View>
        <View style={styles.row}>
          <InfoText>You have given</InfoText>
          <View style={styles.inlineComponent}>{this.props.delegate}</View>
          <InfoText>your influence</InfoText>
        </View>
      </View>
    );
  }
}

class InfoText extends Component {
  render () {
    return (
      <Text style={styles.text}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  inlineComponent: {
    marginHorizontal: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32
  },
  text: {
    fontSize: 16
  }
});
