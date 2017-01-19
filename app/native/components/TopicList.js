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

function renderTopic (topic) {
  return (
    <TouchableHighlight key={topic.id} onPress={() => Actions.topic({ id: topic.id })}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>
        {topic.text}
      </Text>
    </TouchableHighlight>
  );
}

export class TopicList extends Component {
  constructor (props) {
    super(props);
    this.state = { topics: [] };
    fetch('http://192.168.1.72:3714/api/topic')
      .then(response => response.json())
      .then(topics => this.setState({ topics }))
      .catch(error => {
        console.error(error);
      });
  }

  render () {
    return (
      <View style={styles.container}>
        {/*
        <Text style={styles.welcome}>
          Topics {this.state.topics.length}
        </Text>
        */}
        <View style={{ flex: 5 }}>
          <ScrollView>
            { this.state.topics.map(renderTopic) }
            {/*
            <TouchableHighlight key='-1' onPress={() => Actions.topic({ id: 0 })}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Mauna Kea Telescopes
              </Text>
            </TouchableHighlight>
            */}
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
    marginTop: 70
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
