/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type InfluenceProps = {
  influence: number,
  style: Object,
  fontSize: number
};

type DefaultInfluenceProps = {
  style: Object,
  fontSize: number
};

export default class Influence extends Component<
  DefaultInfluenceProps,
  InfluenceProps,
  void
> {
  static defaultProps = {
    style: {},
    fontSize: 16
  };

  render() {
    const fontSize = this.props.fontSize;
    return (
      <View style={[styles.influence, this.props.style]}>
        <Text style={{ fontSize }}>
          {this.props.influence}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  influence: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 16,
    paddingVertical: 4,
    paddingHorizontal: 8
  }
});
