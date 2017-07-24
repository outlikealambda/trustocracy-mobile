import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

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

Summary.propTypes = {
  prompt: PropTypes.object.isRequired
};

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
        <ScalarPrompt text={this.props.prompt.text} />
        <ScalarLabels
          left={this.props.prompt.options[0].text}
          right={this.props.prompt.options[0].text}
        />
        <Histogram
          width={this.props.width}
          height={this.props.height}
          data={this.props.summaryData}
        />
      </View>
    );
  }
}

ScalarSummary.propTypes = {
  viewStyle: PropTypes.object,
  prompt: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  summaryData: PropTypes.array.isRequired
};

const ScalarPrompt = ({ text }) => {
  return (
    <View>
      <Text style={styles.scalarPrompt}>
        {text}
      </Text>
    </View>
  );
};

ScalarPrompt.propTypes = {
  text: PropTypes.string.isRequired
};

const ScalarLabels = ({ left, right }) => {
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
            {left}
          </Text>
        </View>
        <View>
          <Text style={styles.labelText}>
            {right}
          </Text>
        </View>
      </View>
    </View>
  );
};

ScalarLabels.propTypes = {
  left: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired
};

const histogramColorSelector = D3Scale.scaleLinear()
  .domain([0, 1])
  .range([Colors.orange, Colors.electricBlue]);

const Histogram = ({ width = 320, height = 64, data }) => {
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

Histogram.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array.isRequired
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
        <Pie {...this.props} data={this.props.summaryData} />
        <PiePrompt
          text={this.props.prompt.text}
          options={this.props.prompt.options}
          headerStyle={this.props.prompt.headerStyle}
          textStyle={this.props.prompt.textStyle}
        />
      </View>
    );
  }
}

MultipleChoiceSummary.propTypes = {
  viewStyle: PropTypes.object,
  summaryData: PropTypes.array.isRequired,
  prompt: PropTypes.object
};

const pieColors = ['#52BE80', '#5499C7', '#AF7AC5', '#F4D03F'];

const getPieColor = idx => pieColors[idx % pieColors.length];

const defaultPieOptions = {
  innerRadius: 20,
  outerRadius: 50,
  padAngle: Math.PI / 90,
  width: 100,
  height: 100
};

const Pie = ({
  innerRadius = defaultPieOptions.innerRadius,
  outerRadius = defaultPieOptions.outerRadius,
  padAngle = defaultPieOptions.padAngle,
  width = defaultPieOptions.width,
  height = defaultPieOptions.height,
  data
}) => {
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

Pie.propTypes = {
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  padAngle: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.array.isRequired
};

const PiePrompt = ({ text, options, headerStyle = {}, textStyle = {} }) => {
  return (
    <View style={styles.piePrompt}>
      <Text style={[styles.piePromptHeader, headerStyle]}>
        {text}
      </Text>
      {options.map(option =>
        <Text
          key={option.sortOrder}
          style={[
            styles.piePromptOption,
            { color: getPieColor(option.sortOrder) },
            textStyle
          ]}
        >
          {option.text}
        </Text>
      )}
    </View>
  );
};

PiePrompt.propTypes = {
  text: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  headerStyle: PropTypes.object,
  textStyle: PropTypes.object
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
  piePromptHeader: { marginBottom: 4, fontSize: 16 },
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
