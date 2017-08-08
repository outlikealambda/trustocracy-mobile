/**
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Metric from '../Metric.js';
import * as Colors from '../../colors.js';

type Props = {
  prompt: Object,
  answer: Object,
  key: number
};

export default class Stance extends Component<void, Props, void> {
  render() {
    const { prompt, answer } = this.props;
    return (
      <View style={styles.position}>
        <Prompt text={prompt.textShort} />
        <Answer prompt={prompt} answer={answer} />
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
  position: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    minHeight: 24
  },
  prompt: {
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
    paddingRight: 8
  },
  answer: {
    flex: 1,
    alignItems: 'center'
  }
});
