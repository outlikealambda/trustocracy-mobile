/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';

const iconStyles = {
  get(size = Sizes.LARGE) {
    return this[normalizeSize(size)];
  },
  large: {
    fontSize: 32
  },
  medium: {
    fontSize: 24
  },
  small: {
    fontSize: 16
  }
};

const button = {
  small: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  medium: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  large: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const initialsFont = {
  small: 12,
  medium: 16,
  large: 20
};

const buttonStyles = {
  getStyle(shape = 'circle', size = Sizes.LARGE) {
    size = normalizeSize(size);

    switch (shape.toLowerCase()) {
      case 'circle':
        return this.circle[size];
      case 'square':
        return this.square[size];
      default:
        console.warn('unknown shape, defaulting to large circle');
        return this.circle.large;
    }
  },
  circle: StyleSheet.create({
    small: Object.assign({ borderRadius: 14 }, button.small),
    medium: Object.assign({ borderRadius: 22 }, button.medium),
    large: Object.assign({ borderRadius: 30 }, button.large)
  }),
  square: StyleSheet.create({
    small: Object.assign({ borderRadius: 2 }, button.small),
    medium: Object.assign({ borderRadius: 2 }, button.medium),
    large: Object.assign({ borderRadius: 2 }, button.large)
  })
};

const rectangularStyles = {
  get: function(size = Sizes.LARGE) {
    size = normalizeSize(size);
    return this[size];
  },
  large: StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: 48,
      borderRadius: 24
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8,
      marginHorizontal: 12
    }
  }),
  small: StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: 32,
      borderRadius: 16
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      marginVertical: 4,
      marginHorizontal: 8
    }
  })
};

const wrapWithTouchable = (nativeComponent, onPress) =>
  <TouchableOpacity
    onPress={onPress}
    style={{ justifyContent: 'center', alignItems: 'center' }}
  >
    {nativeComponent}
  </TouchableOpacity>;

/*
  type RoundedProps = {
    text: string,
    size: string,
    style: Object<any>,
    onPress: Function
  };
*/

export class RoundedButton extends Component {
  render() {
    const text = this.props.text;
    const onPress = this.props.onPress;
    const size = this.props.size;
    const style = rectangularStyles.get(size);
    const buttonStyle = this.props.buttonStyle || {};

    const button = (
      <View style={[style.container, buttonStyle]}>
        <Text style={style.text}>
          {text}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(button, onPress) : button;
  }
}

/*
  type IconProps = {
    backgroundColor: string,
    name: string
  };
*/

export class IconButton extends Component {
  render() {
    const backgroundColor = this.props.backgroundColor;
    const name = this.props.name;
    const color = this.props.color || 'black';
    const size = this.props.size;
    const iconStyle = this.props.iconStyle || {};
    const onPress = this.props.onPress;
    const baseStyle = buttonStyles.getStyle(this.props.shape, size);
    const buttonStyle = this.props.buttonStyle || {};

    const icon = (
      <View style={[baseStyle, { backgroundColor }, buttonStyle]}>
        <Octicons
          style={[iconStyles.get(size), iconStyle]}
          name={name}
          color={color}
        />
      </View>
    );

    return onPress ? wrapWithTouchable(icon, onPress) : icon;
  }
}

/*
  type InitialsProps = {
    backgroundColor: string,
    initials: string,
    circleStyle: Object<any>
  };
*/

export class InitialsButton extends Component {
  render() {
    const backgroundColor = this.props.backgroundColor;
    const initials = this.props.initials;
    const size = normalizeSize(this.props.size || Sizes.LARGE);
    const onPress = this.props.onPress;
    const baseStyle = buttonStyles.getStyle(this.props.shape, size);
    const buttonStyle = this.props.buttonStyle || {};
    const fontSize =
      initialsFont[normalizeSize(this.props.size || Sizes.LARGE)];

    const button = (
      <View style={[baseStyle, { backgroundColor }, buttonStyle]}>
        <Text style={{ fontSize, fontWeight: 'bold', color: '#444' }}>
          {initials}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(button, onPress) : button;
  }
}

export const Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

function normalizeSize(size) {
  const enumerated = Object.values(Sizes).find(s => s === size);

  if (!enumerated) {
    console.warn('unknown size', size);
    return Sizes.LARGE;
  }

  return enumerated;
}
