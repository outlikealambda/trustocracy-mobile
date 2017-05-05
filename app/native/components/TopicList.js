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

type Topic = {
  id: string,
  text: string
};

type Props = {
  navigation: Object<any>
};

type State = {
  topics: Array<Topic>
};

export class TopicList extends Component<void, Props, State> {
  state: State

  static navigationOptions = {
    title: 'Topics'
  };

  constructor (props: Props) {
    super(props);
    this.state = { topics: [] };
    const host = '127.0.0.1';
    global.fetch(`http://${host}:3714/api/topic`)
      .then(response => response.json())
      .then(topics => this.setState({ topics }))
      .catch(error => {
        console.error(error);
      });
  }

  render () {
    const { navigate } = this.props.navigation;
    const renderTopic = topic => {
      return (
        <TouchableHighlight key={topic.id} onPress={() => navigate('topic', { id: topic.id, title: topic.text })}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>
            {topic.text}
          </Text>
        </TouchableHighlight>
      );
    };

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => navigate('delegate')}>
          <Text>Delegatesss</Text>
        </TouchableHighlight>
        <View style={{ flex: 5 }}>
          <ScrollView>
            { this.state.topics.map(renderTopic) }
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
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
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
