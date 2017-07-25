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
import { DelegateIcon } from './delegate/Delegate.js';
import * as Api from './api.js';
import * as Metric from './Metric.js';

type Topic = {
  id: number,
  text: string,
  title: string,
  prompts: Array<any>
};

type Props = {
  navigation: Object
};

type State = {
  topics: Array<Topic>
};

export class TopicList extends Component<void, Props, State> {
  state: State;

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Topics',
      headerRight: DelegateIcon(navigation.navigate)
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = { topics: [] };
    Api.topics()
      .then(response => response.json())
      .then(fetchMetrics)
      .then(topics => this.setState({ topics }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <ScrollView>
            {this.state.topics.map(topic =>
              SingleTopic(topic, this.props.navigation)
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const fetchMetrics = topics => {
  return Promise.all(
    topics.map(topic =>
      Api.prompts(topic.id)
        .then(response => response.json())
        .then(prompts => Object.assign({}, topic, { prompts }))
    )
  );
};

const SingleTopic = (props: Topic, { navigate }) => {
  const navigationParameters = {
    id: props.id,
    title: props.title,
    prompts: props.prompts
  };

  return (
    <TouchableHighlight
      key={props.id}
      onPress={() => navigate('topic', navigationParameters)}
    >
      <View
        style={{
          borderTopWidth: 2,
          borderTopColor: '#ccc'
        }}
      >
        <View
          style={{
            paddingHorizontal: 32,
            paddingVertical: 16,
            backgroundColor: '#eee'
          }}
        >
          <Text style={{ fontSize: 20, color: '#444', fontWeight: 'bold' }}>
            {props.text}
          </Text>
        </View>
        {props.prompts.map(MetricWithFakeValues)}
      </View>
    </TouchableHighlight>
  );
};

const MetricWithFakeValues = (prompt, idx, array) => {
  const { id: key, options } = prompt;
  const values = [];
  const isLast = idx === array.length - 1;

  if (Metric.isMultipleChoice(prompt)) {
    for (let i = 0; i < options.length; i++) {
      values.push(Math.random());
    }
  } else {
    for (let i = 0; i < 10; i++) {
      values.push(Math.random());
    }
  }

  return (
    <View
      key={key}
      style={{
        flex: 1,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#eee'
      }}
    >
      <Metric.Summary prompt={prompt} summaryData={values} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF'
  }
});
