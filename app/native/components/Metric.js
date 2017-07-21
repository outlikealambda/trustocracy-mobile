import React, { Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Svg } from 'expo';
import * as Colors from '../colors.js';

import * as D3Shape from 'd3-shape';
import * as D3Scale from 'd3-scale';

export const isScalar = prompt => prompt.type === 'SCALAR';

export const isMultipleChoice = prompt => prompt.type === 'MULTIPLE_CHOICE';

export class Summary extends Component {
  render() {
    const prompt = this.props.prompt;

    if (isScalar(prompt)) {
      return <ScalarSummary {...this.props} />;
    }

    if (isMultipleChoice(prompt)) {
      return <MultipleChoiceSummary {...this.props} />;
    }
  }
}

/**
  type ScalarProps = {
    width,
    height,
    viewStyle,
    prompt,
    summaryData // should already be bucketed for a histogram
  }
 */

class ScalarSummary extends Component {
  render() {
    return (
      <View style={[styles.scalarContainer, this.props.viewStyle]}>
        {renderScalarPrompt(this.props, this.props.prompt)}
        {renderScalarLabels(this.props, this.props.prompt)}
        {renderHistogram(this.props, this.props.summaryData)}
      </View>
    );
  }
}

const renderScalarPrompt = (renderingOptions, prompt) => {
  return (
    <View>
      <Text style={styles.scalarPrompt}>
        {prompt.text}
      </Text>
    </View>
  );
};

const renderScalarLabels = (renderingOptions, prompt) => {
  return (
    <View
      style={{
        marginVertical: 4,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1
        }}
      >
        <View>
          <Text style={styles.labelText}>
            {prompt.options[0].text}
          </Text>
        </View>
        <View>
          <Text style={styles.labelText}>
            {prompt.options[1].text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const histogramColorSelector = D3Scale.scaleLinear()
  .domain([0, 1])
  .range([Colors.orange, Colors.electricBlue]);

const renderHistogram = (renderingOptions, data) => {
  const width = renderingOptions.width || 320;
  const height = renderingOptions.height || 64;

  const maxData = Math.max(...data);

  const xScale = D3Scale.scaleBand()
    .rangeRound([0, width])
    .padding(0.25)
    .domain(data);

  const yScale = D3Scale.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, maxData]);

  return (
    <Svg width={width} height={height}>
      <Svg.G>
        {data.map((bar, idx, { length }) =>
          <Svg.Rect
            key={idx}
            x={xScale(bar)}
            y={yScale(bar) / 2}
            rx={4}
            ry={4}
            width={xScale.bandwidth()}
            height={height - yScale(bar)}
            fill={histogramColorSelector(idx / (length - 1))}
          />
        )}
      </Svg.G>
    </Svg>
  );
};

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
  render() {
    return (
      <View style={[styles.multipleChoiceContainer, this.props.viewStyle]}>
        {renderPie(this.props, this.props.summaryData)}
        {renderPiePrompt(this.props, this.props.prompt)}
      </View>
    );
  }
}

const pieColors = ['#52BE80', '#5499C7', '#AF7AC5', '#F4D03F'];

const getPieColor = idx => pieColors[idx % pieColors.length];

const defaultPieOptions = {
  innerRadius: 20,
  outerRadius: 50,
  padAngle: Math.PI / 90,
  width: 100,
  height: 100
};

const renderPie = (renderingOptions, data) => {
  const innerRadius =
    renderingOptions.innerRadius || defaultPieOptions.innerRadius;
  const outerRadius =
    renderingOptions.outerRadius || defaultPieOptions.outerRadius;
  const padAngle = renderingOptions.padAngle || defaultPieOptions.padAngle;
  const width = renderingOptions.width || defaultPieOptions.width;
  const height = renderingOptions.height || defaultPieOptions.height;

  return (
    <Svg width={width} height={height}>
      <Svg.G x={width / 2} y={height / 2}>
        {D3Shape.pie().padAngle(padAngle)(data)
          .map(D3Shape.arc().innerRadius(innerRadius).outerRadius(outerRadius))
          .map((arc, idx) =>
            <Svg.Path d={arc} key={idx} fill={getPieColor(idx)} />
          )}
      </Svg.G>
    </Svg>
  );
};

const renderPiePrompt = (renderingOptions, prompt) => {
  const headerStyle = renderingOptions.headerStyle || {};
  const optionStyle = renderingOptions.textStyle || {};

  return (
    <View style={styles.piePrompt}>
      <Text style={[styles.piePromptHeader, headerStyle]}>
        {prompt.text}
      </Text>
      {prompt.options.map(option =>
        <Text
          key={option.sortOrder}
          style={[
            styles.piePromptOption,
            { color: getPieColor(option.sortOrder) },
            optionStyle
          ]}
        >
          {option.text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scalarContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  multipleChoiceContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  piePrompt: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1
  },
  piePromptHeader: {
    marginBottom: 4,
    fontSize: 16
  },
  piePromptOption: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 16,
    fontWeight: 'bold'
  },
  labelText: {
    color: '#666',
    fontStyle: 'italic'
  },
  scalarPrompt: {
    padding: 8,
    paddingBottom: 16,
    fontSize: 16
  }
});
