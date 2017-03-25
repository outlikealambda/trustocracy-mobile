/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8
  }
});

const wrapWithTouchable = (nativeComponent, onPress) => (
  <TouchableHighlight
    onPress={onPress}
    style={{justifyContent: 'center', alignItems: 'center'}}>
    {nativeComponent}
  </TouchableHighlight>
);

type IconProps = {
  backgroundColor: string,
  name: string,
  size: number,
  style: Object<any>
};

export class IconButton extends Component<void, IconProps, void> {
  render () {
    const backgroundColor = this.props.backgroundColor;
    const name = this.props.name;
    const size = this.props.size || 16;
    const color = this.props.color || 'black';
    const style = this.props.style || {};
    const onPress = this.props.onPress;

    const icon = (
      <View style={[styles.circle, {backgroundColor}]} >
        <Icon style={[style, {backgroundColor: 'transparent'}]} name={name} size={size} color={color} />
      </View>
    );

    return onPress ? wrapWithTouchable(icon, onPress) : icon;
  }
}

type InitialsProps = {
  backgroundColor: string,
  initials: string,
  circleStyle: Object<any>
};

export class InitialsButton extends Component<void, InitialsProps, void> {
  render () {
    const backgroundColor = this.props.backgroundColor;
    const initials = this.props.initials;
    const style = this.props.style || {};
    const onPress = this.props.onPress;

    const circleView = (
      <View style={[styles.circle, {backgroundColor}, style]}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {initials}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(circleView, onPress) : circleView;
  }
}
