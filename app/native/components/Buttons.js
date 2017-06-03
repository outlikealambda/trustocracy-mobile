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

const buttonStyles = {
  getStyle (shape, isSmall) {
    switch (shape.toLowerCase()) {
      case 'circle':
        return isSmall ? this.circle.small : this.circle.regular;
      case 'square':
        return isSmall ? this.square.small : this.square.regular;
      default:
        console.warn('unknown shape, defaulting to circle');
        return this.circle.regular;
    }
  },
  circle: StyleSheet.create({
    small: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8
    },
    regular: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8
    }
  }),
  square: StyleSheet.create({
    regular: {
      width: 60,
      height: 60,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8
    },
    small: {
      width: 28,
      height: 28,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8
    }
  })
};

const rectangularStyles = StyleSheet.create({
  roundedContainer: {
    justifyContent: 'center',
    height: 48,
    borderRadius: 24
  },
  roundedContainerSmall: {
    justifyContent: 'center',
    height: 32,
    borderRadius: 16
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    marginHorizontal: 12
  },
  buttonTextSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 4,
    marginHorizontal: 8
  }
});

const wrapWithTouchable = (nativeComponent, onPress) => (
  <TouchableHighlight
    onPress={onPress}
    style={{justifyContent: 'center', alignItems: 'center'}}>
    {nativeComponent}
  </TouchableHighlight>
);

type RoundedProps = {
  text: string,
  size: string,
  style: Object<any>,
  onPress: Function
};

export class RoundedButton extends Component<void, RoundedProps, void> {
  render () {
    const text = this.props.text;
    const onPress = this.props.onPress;
    const isSmall = this.props.size && this.props.size === 'small';
    const baseStyle = isSmall ? rectangularStyles.roundedContainerSmall : rectangularStyles.roundedContainer;
    const buttonStyle = this.props.buttonStyle || {};
    const textStyle = isSmall ? rectangularStyles.buttonTextSmall : rectangularStyles.buttonText;

    const button = (
      <View style={[baseStyle, buttonStyle]}>
        <Text style={textStyle}>
          { text }
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(button, onPress) : button;
  }
}

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
    const size = this.props.size || (this.props.isSmall ? 16 : 20);
    const color = this.props.color || 'black';
    const iconStyle = this.props.iconStyle || {};
    const onPress = this.props.onPress;
    const basicStyle = buttonStyles.getStyle(this.props.shape, this.props.isSmall);
    const buttonStyle = this.props.buttonStyle || {};

    const icon = (
      <View style={[basicStyle, {backgroundColor}, buttonStyle]} >
        <Icon style={[{backgroundColor: 'transparent'}, iconStyle]} name={name} size={size} color={color} />
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
    const buttonStyle = buttonStyles.getStyle(this.props.shape, this.props.isSmall);
    const fontSize = this.props.isSmall ? 12 : 22;

    const button = (
      <View style={[buttonStyle, {backgroundColor}, style]}>
        <Text style={{fontSize, fontWeight: 'bold'}}>
          {initials}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(button, onPress) : button;
  }
}
