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
      animatedHeight: new Animated.Value(),
      animatedOpacity: new Animated.Value()
    };
  }

  show = delay => {
    this.resize(1, this.state.expandedHeight, delay, true);
  }

  hide = () => {
    this.resize(this.state.expandedHeight, 1);
  }

  resize = (from, to, delay, isShowing) => {
    delay = delay || 0;

    const opacityStart = isShowing ? 0 : 1;
    const opacityEnd = isShowing ? 1 : 0;

    this.state.animatedHeight.setValue(from);
    this.state.animatedOpacity.setValue(opacityStart);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(
          this.state.animatedHeight,
          {
            toValue: to
          }
        ),
        Animated.timing(
          this.state.animatedOpacity,
          {
            toValue: opacityEnd
          }
        )
      ])
    ]).start();
  }

  _setHeight = event => {
    if (!this.state.expandedHeight) {
      this.setState({
        animatedHeight: new Animated.Value(0),
        expandedHeight: event.nativeEvent.layout.height
      });
    }
  }

  componentWillReceiveProps (next) {
    if (next.open !== this.props.open) {
      next.open ? this.show(next.openDelay) : this.hide();
    }
  }

  render () {
    return (
      <Animated.View
        style={{
          height: this.state.animatedHeight,
          opacity: this.state.animatedOpacity,
          overflow: 'hidden'
        }}>
        <View onLayout={this._setHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}
