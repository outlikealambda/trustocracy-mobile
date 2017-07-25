/**
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';

export const Sizes = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

export type SizeType = 'small' | 'medium' | 'large';

export const Shapes = {
  SQUARE: 'square',
  CIRCLE: 'circle'
};

export type ShapeType = 'square' | 'circle';

const iconStyles = {
  get(size: SizeType) {
    return this[size];
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
  getStyle(shape: ShapeType, size: SizeType) {
    return this[shape][size];
  },
  circle: StyleSheet.create({
    small: Object.assign({}, { borderRadius: 14 }, button.small),
    medium: Object.assign({}, { borderRadius: 22 }, button.medium),
    large: Object.assign({}, { borderRadius: 30 }, button.large)
  }),
  square: StyleSheet.create({
    small: Object.assign({}, { borderRadius: 2 }, button.small),
    medium: Object.assign({}, { borderRadius: 2 }, button.medium),
    large: Object.assign({}, { borderRadius: 2 }, button.large)
  })
};

const rectangularStyles = {
  get: function(size: SizeType) {
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
  medium: StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: 40,
      borderRadius: 20
    },
    text: {
      fontSize: 15,
      fontWeight: 'bold',
      marginVertical: 6,
      marginHorizontal: 10
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

type RoundedProps = {
  text: string,
  size: SizeType,
  buttonStyle: Object,
  onPress?: Function
};

type DefaultRoundedProps = {
  buttonStyle: Object,
  size: SizeType
};

export class RoundedButton extends Component<
  DefaultRoundedProps,
  RoundedProps,
  void
> {
  static defaultProps = {
    buttonStyle: {},
    size: Sizes.LARGE
  };

  render() {
    const style = rectangularStyles.get(this.props.size);

    const button = (
      <View style={[style.container, this.props.buttonStyle]}>
        <Text style={style.text}>
          {this.props.text}
        </Text>
      </View>
    );

    return this.props.onPress
      ? wrapWithTouchable(button, this.props.onPress)
      : button;
  }
}

type DefaultIconProps = {
  shape: ShapeType,
  size: SizeType,
  iconStyle: Object | Array<Object>,
  color: string,
  buttonStyle: Object
};

type IconProps = {
  name: string,
  color: string,
  shape: ShapeType,
  size: SizeType,
  buttonStyle: Object,
  iconStyle: Object | Array<Object>,
  backgroundColor?: string,
  onPress?: Function
};

export class IconButton extends Component<DefaultIconProps, IconProps, void> {
  static defaultProps = {
    size: Sizes.LARGE,
    shape: Shapes.CIRCLE,
    iconStyle: {},
    color: 'black',
    buttonStyle: {}
  };

  render() {
    const backgroundColor = this.props.backgroundColor;
    const name = this.props.name;
    const color = this.props.color;
    const size = this.props.size;
    const iconStyle = this.props.iconStyle;
    const onPress = this.props.onPress;
    const baseStyle = buttonStyles.getStyle(this.props.shape, size);
    const buttonStyle = this.props.buttonStyle;

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

type DefaultInitialsProps = {
  shape: ShapeType,
  size: SizeType,
  buttonStyle: Object
};

type InitialsProps = {
  initials: string,
  shape: ShapeType,
  size: SizeType,
  buttonStyle: Object,
  backgroundColor?: string,
  onPress?: Function
};

export class InitialsButton extends Component<
  DefaultInitialsProps,
  InitialsProps,
  void
> {
  static defaultProps = {
    shape: Shapes.CIRCLE,
    size: Sizes.LARGE,
    buttonStyle: {}
  };

  render() {
    const backgroundColor = this.props.backgroundColor;
    const initials = this.props.initials;
    const size = this.props.size;
    const onPress = this.props.onPress;
    const baseStyle = buttonStyles.getStyle(this.props.shape, size);
    const buttonStyle = this.props.buttonStyle;
    const fontSize = initialsFont[size];

    const button = (
      <View style={[baseStyle, { backgroundColor }, buttonStyle]}>
        <Text style={{ fontSize, color: '#444' }}>
          {initials}
        </Text>
      </View>
    );

    return onPress ? wrapWithTouchable(button, onPress) : button;
  }
}
