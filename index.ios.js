/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
// import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

export default class Trustocracy extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Mauna Kea Telescopes
        </Text>
        {/* <View style={{ height: 50,
            borderTopColor: 'gray',
            borderTopWidth: 2,
            borderBottomColor: 'gray',
            borderBottomWidth: 2 }}>
          <ScrollView horizontal style={{ backgroundColor: 'orange' }}>
            <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'green'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'red'}} />
            <View style={{width: 50, height: 50, backgroundColor: 'purple'}} />
          </ScrollView>
        </View>
        <View style={{ height: 54,
            borderTopColor: 'gray',
            borderTopWidth: 2,
            borderBottomColor: 'gray',
            borderBottomWidth: 2 }}>
          <ScrollView horizontal>
            <Svg height='50' width='300'>
              <Circle cx='25' cy='25' r='20' fill='greenyellow' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='25'
                y='10'
                textAnchor='middle'>
                TR
              </SvgText>
              <Circle cx='75' cy='25' r='20' fill='dodgerblue' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='75'
                y='10'
                textAnchor='middle'>
                AR
              </SvgText>
              <Circle cx='125' cy='25' r='20' fill='darkorange' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='125'
                y='10'
                textAnchor='middle'>
                MR
              </SvgText>
              <Circle cx='175' cy='25' r='20' fill='fuchsia' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='175'
                y='10'
                textAnchor='middle'>
                ME
              </SvgText>
              <Circle cx='225' cy='25' r='20' fill='red' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='225'
                y='10'
                textAnchor='middle'>
                MA
              </SvgText>
              <Circle cx='275' cy='25' r='20' fill='cyan' />
              <SvgText
                stroke='darkgray'
                fontSize='18'
                fontWeight='bold'
                x='275'
                y='10'
                textAnchor='middle'>
                KY
              </SvgText>
            </Svg>
          </ScrollView>
        </View> */}
        <View style={{ height: 60,
            borderTopColor: 'gray',
            borderTopWidth: 2,
            borderBottomColor: 'gray',
            borderBottomWidth: 2 }}>
          <ScrollView horizontal>
            <View style={{width: 50,
                height: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                margin: 3,
                backgroundColor: styles.container.backgroundColor,
                borderWidth: 3,
                borderColor: 'lightblue' }}>
              <View style={[ { backgroundColor: 'greenyellow' }, styles.circle ]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  TR
                </Text>
              </View>
            </View>
            <View style={[ { backgroundColor: 'dodgerblue' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                AR
              </Text>
            </View>
            <View style={[ { backgroundColor: 'darkorange' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MR
              </Text>
            </View>
            <View style={[ { backgroundColor: 'fuchsia' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                ME
              </Text>
            </View>
            <View style={[ { backgroundColor: 'red' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MA
              </Text>
            </View>
            <View style={[ { backgroundColor: 'cyan' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                KY
              </Text>
            </View>
            <View style={[ { backgroundColor: 'green' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                DP
              </Text>
            </View>
            <View style={[ { backgroundColor: 'moccasin' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                MM
              </Text>
            </View>
            <View style={[ { backgroundColor: 'lightgray' }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'gray' }}>
                JD
              </Text>
            </View>
          </ScrollView>
        </View>
        <View style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[ styles.circle, { backgroundColor: 'darkorange', marginRight: 0 } ]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              MR
            </Text>
          </View>
          <View style={{ height: 3, width: 40, backgroundColor: 'gray' }} />
          <View style={[ styles.circle, { backgroundColor: 'lightgray', marginLeft: 0, marginRight: 0 } ]} />
          <View style={{ height: 3, width: 40, backgroundColor: 'gray' }} />
          <View style={{ backgroundColor: 'lightgray', justifyContent: 'center', height: 40, borderRadius: 20 }}>
            <Text style={{ margin: 8, fontSize: 16, fontWeight: 'bold' }}>
              Harrison Guerra
            </Text>
          </View>
        </View>
        {/*
        <Svg height='50' width='300'>
          <Rect x='25' y='24' width='250' height='2' fill='gray' />
          <Circle cx='25' cy='25' r='20' fill='orange' />
          <SvgText
            stroke='darkgray'
            fontSize='18'
            fontWeight='bold'
            x='25'
            y='10'
            textAnchor='middle'>
            MR
          </SvgText>
          <Circle cx='275' cy='25' r='20' fill='lightgray' />
          <SvgText
            stroke='darkgray'
            fontSize='18'
            fontWeight='bold'
            x='275'
            y='10'
            textAnchor='middle'>
            KY
          </SvgText>
        </Svg> */}
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Text style={[ styles.instructions, { textAlign: 'left', marginLeft: 20, marginRight: 20, marginTop: 20 } ]}>
          I see now. You want to see a UI widget in many possible states for the purposes of seeing a visual regression. (By "widget", I mean some piede of HTML generated by a function, not the loaded word "component", which usually implies state. Althought it could be either.) Without saying too much, I know there is some programmatic HTML-based testing in the pipeline but actually seeing the rendered output would be a nice complement to that.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 20
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
    // backgroundColor: 'orange'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8
  }
});

AppRegistry.registerComponent('Trustocracy', () => Trustocracy);
