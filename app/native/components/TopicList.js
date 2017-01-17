/**
 * @flow
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export class TopicList extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Topics
        </Text>
        <View style={{ flex: 5 }}>
          <ScrollView>
            <TouchableHighlight onPress={() => Actions.topic({ id: 0 })}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Mauna Kea Telescopes
              </Text>
            </TouchableHighlight>
            <View style={[ { backgroundColor: 'dodgerblue' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                AR
              </Text>
            </View>
            <View style={[ { backgroundColor: 'darkorange' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MR
              </Text>
            </View>
            <View style={[ { backgroundColor: 'fuchsia' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                ME
              </Text>
            </View>
            <View style={[ { backgroundColor: 'red' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MA
              </Text>
            </View>
            <View style={[ { backgroundColor: 'cyan' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                KY
              </Text>
            </View>
            <View style={[ { backgroundColor: 'green' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                DP
              </Text>
            </View>
            <View style={[ { backgroundColor: 'moccasin' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MM
              </Text>
            </View>
            <View style={[ { backgroundColor: 'lightgray' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'gray' }}>
                JD
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 20
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
    // backgroundColor: 'orange'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8
  }
});
