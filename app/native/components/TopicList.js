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
import Svg, {
  G,
  Path
} from 'react-native-svg';
import * as D3Shape from 'd3-shape';
import { Prompts } from '../utils.js';

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

const pieColors = [
  '#52BE80',
  '#5499C7',
  '#AF7AC5',
  '#F4D03F'
];

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
    const {id: key, options, text} = prompt;

    if (Prompts.isScalar(prompt)) {
      return [];
    }

    const values = [];

    for (let i = 0; i < options.length; i++) {
      values.push(Math.random());
    }

    const pies = D3Shape.pie().padAngle(Math.PI / 90)(values);
    const arcGenerator = D3Shape.arc()
      .innerRadius(20)
      .outerRadius(50);

    const arcs = pies.map(arcGenerator);

    return (
      <View
        key={key}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center'
        }}>
        <Svg height='100' width='100'>
          <G x='50' y='50' >
            {arcs.map((arc, idx) => (
              <Path
                d={arc}
                key={idx}
                fill={pieColors[idx % pieColors.length]}
              />
            ))}
          </G>
        </Svg>
        <View
          style={{
            padding: 8,
            flex: 1
          }}>
          <Text>{text}</Text>
          {options.map(option => (
            <Text
              key={option.sortOrder}
              style={{
                fontWeight: 'bold',
                color: pieColors[option.sortOrder % pieColors.length]
              }}>
              {option.text}
            </Text>
          ))}
        </View>
      </View>
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
