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
  getStyle (shape) {
    switch (shape.toLowerCase()) {
      case 'circle':
        return this.circle;
      case 'square':
        return this.square;
      default:
        console.warn('unknown shape, defaulting to circle');
        return this.circle;
    }
  },
  circle: StyleSheet.create({
    regular: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8
    }
  }),
  square: StyleSheet.create({
    regular: {
      width: 40,
      height: 40,
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
    height: 40,
    borderRadius: 20
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
    fontSize: 12,
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
    const style = this.props.style || {};
    const onPress = this.props.onPress;
    const isSmall = this.props.size && this.props.size === 'small';
    const containerStyle = isSmall ? rectangularStyles.roundedContainerSmall : rectangularStyles.roundedContainer;
    const textStyle = isSmall ? rectangularStyles.buttonTextSmall : rectangularStyles.buttonText;

    const button = (
      <View style={[containerStyle, style]}>
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
    const size = this.props.size || 16;
    const color = this.props.color || 'black';
    const style = this.props.style || {};
    const onPress = this.props.onPress;
    const styles = buttonStyles.getStyle(this.props.shape);

    const icon = (
      <View style={[styles.regular, {backgroundColor}]} >
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
    const styles = buttonStyles.getStyle(this.props.shape);

    const circleView = (
      <View style={[styles.regular, {backgroundColor}, style]}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          {initials}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(circleView, onPress) : circleView;
  }
}
