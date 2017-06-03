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
import * as Api from './api.js';
import { Summary as PromptSummary } from './Prompt.js';

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
    Api.topics()
      .then(response => response.json())
      .then(this.fetchPrompts)
      .then(topics => this.setState({ topics }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchPrompts = topics => {
    return Promise.all(topics.map(topic =>
      Api.prompts(topic.id)
        .then(response => response.json())
        .then(prompts => Object.assign({}, topic, {prompts: Object.values(prompts)}))
    ));
  }

  renderPrompt = prompt => {
    const {id: key, options} = prompt;
    const values = [];

    for (let i = 0; i < options.length; i++) {
      values.push(Math.random());
    }

    return (
      <PromptSummary key={key} prompt={prompt} summaryData={values} />
    );
  }

  renderTopic = (topic, topicIdx) => {
    const { navigate } = this.props.navigation;

    return (
      <TouchableHighlight key={topic.id} onPress={() => navigate('topic', { id: topic.id, title: topic.text })}>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: '#ddd'
          }}>
          <View
            style={{
              paddingHorizontal: 32,
              paddingVertical: 16,
              backgroundColor: '#eee'
            }}>
            <Text style={{ fontSize: 20, color: '#444', fontWeight: 'bold' }}>
              {topic.text}
            </Text>
          </View>
          {topic.prompts.map(this.renderPrompt)}
        </View>
      </TouchableHighlight>
    );
  };

  renderDelegateButton = () => {
    const { navigate } = this.props.navigation;

    return (
      <TouchableHighlight onPress={() => navigate('delegate')}>
        <Text>Delegatesss</Text>
      </TouchableHighlight>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderDelegateButton()}
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <ScrollView>
            { this.state.topics.map(this.renderTopic) }
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
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF'
  }
});
