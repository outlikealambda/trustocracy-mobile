import React, { Component } from 'react';
import { Animated, View } from 'react-native';

type State = {

};

type Props = {
  open: boolean
};

export class SlidingDrawer extends Component<void, Props, State> {
  constructor (props) {
    super(props);

    this.state = {
      animation: new Animated.Value()
    };
  }

  show = () => {
    this.resize(0, this.state.expandedHeight);
  }

  hide = () => {
    this.resize(this.state.expandedHeight, 0);
  }

  resize = (from, to) => {
    this.state.animation.setValue(from);

    Animated.timing(
      this.state.animation,
      {
        toValue: to
      }
    ).start();
  }

  _setHeight = event => {
    if (!this.state.expandedHeight) {
      this.setState({
        animation: new Animated.Value(0),
        expandedHeight: event.nativeEvent.layout.height
      });
    }
  }

  componentWillReceiveProps (next) {
    if (next.open !== this.props.open) {
      next.open ? this.show() : this.hide();
    }
  }

  render () {
    return (
      <Animated.View
        style={{
          height: this.state.animation,
          overflow: 'hidden'
        }}>
        <View style={{backgroundColor: 'yellow', padding: 12}} onLayout={this._setHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}
