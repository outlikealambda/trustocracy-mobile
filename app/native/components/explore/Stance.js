/**
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Metric from '../Metric.js';
import * as Colors from '../../colors.js';

type SingleProps = {
  prompt: Object,
  answer: AnswerType
};

type AnswerType = { value: number } | { selected: number };

export class Single extends Component<void, SingleProps, void> {
  render() {
    const { prompt, answer } = this.props;
    return (
      <View style={styles.stance}>
        <Prompt text={prompt.textShort} />
        <Answer prompt={prompt} answer={answer} />
      </View>
    );
  }
}

type ListProps = {
  prompts: Array<any>,
  answers: Array<AnswerType>
};

export class List extends Component<void, ListProps, void> {
  render() {
    const { prompts, answers } = this.props;

    return (
      <View {...this.props}>
        {prompts.map((prompt, idx) =>
          <Single key={idx} prompt={prompt} answer={answers[idx]} />
        )}
      </View>
    );
  }
}

const Prompt = ({ text }: { text: string }) => {
  return (
    <Text style={styles.prompt}>
      {text.toUpperCase()}
    </Text>
  );
};

const Answer = ({ answer, prompt }: { answer: Object, prompt: Object }) => {
  return Metric.isScalar(prompt)
    ? <ScalarAnswer value={answer.value} />
    : <MultipleChoiceAnswer text={prompt.options[answer.selected].text} />;
};

const ScalarAnswer = ({ value }: { value: number }) => {
  const height = 16;
  const goesLeft = value < 0.5;
  const width = Math.abs(value - 0.51) * 100 / 1;
  const left = goesLeft ? value * 100 / 1 : 51;
  const cornerRadius = 8;

  const style = {
    position: 'absolute',
    left: left + '%',
    width: width + '%',
    height,
    borderBottomLeftRadius: goesLeft ? cornerRadius : 0,
    borderTopLeftRadius: goesLeft ? cornerRadius : 0,
    borderBottomRightRadius: goesLeft ? 0 : cornerRadius,
    borderTopRightRadius: goesLeft ? 0 : cornerRadius,
    backgroundColor: goesLeft ? Colors.electricBlue : Colors.orange
  };

  return (
    <View
      style={[
        styles.answer,
        {
          position: 'relative',
          height
        }
      ]}
    >
      <View
        style={{
          position: 'absolute',
          left: '0%',
          width: '100%',
          height,
          backgroundColor: '#eee',
          borderRadius: 8
        }}
      />
      <View style={style} />
      <View
        style={{
          position: 'absolute',
          left: '49%',
          width: '2%',
          height,
          backgroundColor: '#ccc'
        }}
      />
    </View>
  );
};

const MultipleChoiceAnswer = ({ text }: { text: string }) => {
  return (
    <View style={styles.answer}>
      <Text>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stance: {
    flexDirection: 'row',
    minHeight: 24,
    alignItems: 'center'
  },
  prompt: {
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
    marginRight: 8
  },
  answer: {
    marginLeft: 8,
    flex: 1,
    alignItems: 'center'
  }
});
