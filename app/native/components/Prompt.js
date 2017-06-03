import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Svg, { G, Path } from 'react-native-svg';

import * as D3Shape from 'd3-shape';

export const isScalar = prompt => prompt.type === 'SCALAR';

export const isMultipleChoice = prompt => prompt.type === 'MULTIPLE_CHOICE';

export class Summary extends Component {
  render () {
    const prompt = this.props.prompt;

    if (isScalar(prompt)) {
      return (
        <ScalarSummary {...this.props} />
      );
    }

    if (isMultipleChoice(prompt)) {
      return (
        <MultipleChoiceSummary {...this.props} />
      );
    }
  }
}

class ScalarSummary extends Component {
  render () {
    return null;
  }
}

/**
  type MultipleChoiceProps = {
    innerRadius,
    outerRadius,
    padAngle,
    height,
    width,
    viewStyle,
    optionStyle,
    headerStyle,
    summaryData
  }
 */

class MultipleChoiceSummary extends Component {
  render () {
    return (
      <View
        key={this.props.key}
        style={[styles.summaryContainer, this.props.viewStyle]}>
        {
          renderPie(this.props, this.props.summaryData)
        }
        {
          renderPiePrompt(this.props, this.props.prompt)
        }
      </View>
    );
  }
}

const pieColors = [
  '#52BE80',
  '#5499C7',
  '#AF7AC5',
  '#F4D03F'
];

const getPieColor = idx => pieColors[idx % pieColors.length];

const defaultPieOptions = {
  innerRadius: 20,
  outerRadius: 50,
  padAngle: Math.PI / 90,
  width: 100,
  height: 100
};

const renderPie = (renderingOptions, data) => {
  const innerRadius = renderingOptions.innerRadius || defaultPieOptions.innerRadius;
  const outerRadius = renderingOptions.outerRadius || defaultPieOptions.outerRadius;
  const padAngle = renderingOptions.padAngle || defaultPieOptions.padAngle;
  const width = renderingOptions.width || defaultPieOptions.width;
  const height = renderingOptions.height || defaultPieOptions.height;

  return (
    <Svg width={width} height={height}>
      <G x={width / 2} y={height / 2}>
        {
          D3Shape.pie().padAngle(padAngle)(data)
            .map(D3Shape.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .map((arc, idx) => (
              <Path
                d={arc}
                key={idx}
                fill={getPieColor(idx)}
                />
            ))
        }
      </G>
    </Svg>
  );
};

const renderPiePrompt = (renderingOptions, prompt) => {
  const headerStyle = renderingOptions.headerStyle || {};
  const optionStyle = renderingOptions.textStyle || {};

  return (
    <View
      style={{
        padding: 8,
        flex: 1
      }}>
      <Text style={[headerStyle]}>{prompt.text}</Text>
      {prompt.options.map(option => (
        <Text
          key={option.sortOrder}
          style={[
            styles.piePromptOption,
            {color: getPieColor(option.sortOrder)},
            optionStyle
          ]}>
          {option.text}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  piePromptOption: {
    fontWeight: 'bold'
  }
});
