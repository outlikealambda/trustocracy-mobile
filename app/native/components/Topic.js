/**
 * @flow
 */

import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Markdown from 'react-native-simple-markdown';
import Icon from 'react-native-vector-icons/Octicons';
// import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

const trusteeColors = [
  'greenyellow',
  'dodgerblue',
  'darkorange',
  'fuchsia',
  'red',
  'cyan',
  'green',
  'moccasin'
];

// super fragile...
function initials (friend) {
  if (friend) {
    const { name } = friend;
    return name[0] + name.split(' ')[1][0];
  }
  return '';
}

function selectedCircle (content, key) {
  return (
    <View
      key={key}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
        backgroundColor: styles.container.backgroundColor,
        borderWidth: 3,
        borderColor: 'lightblue' }}>
      {content}
    </View>
  );
}

type Props = {
  id: string
}

type State = {
  userId: number,
  selectedConnectionIdx: number,
  selectedFriendIdx: number,
  bookIdx: number,
  connections: Array<any>,
  title: string,
  expanded: boolean
};

export class Topic extends Component<void, Props, State> {
  state: State

  constructor (props: Props) {
    super(props);
    this.state = {
      userId: 5,
      selectedConnectionIdx: 0,
      selectedFriendIdx: 0,
      bookIdx: 0,
      connections: [],
      title: '',
      expanded: true
    };

    global.fetch(`http://192.168.1.58:3714/api/topic/${this.props.id}/connected/${this.state.userId}`)
      .then(response => response.json())
      .then(connections => this.setState({ connections, bookIdx: connections.length }))
      .catch(error => {
        console.error(error);
      });

    global.fetch(`http://192.168.1.58:3714/api/topic/${this.props.id}`)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.setState({ title }))
      .catch(error => {
        console.error(error);
      });
  }

  render () {
    const selectedConnection = this.state.connections[this.state.selectedConnectionIdx];
    const selectedFriend = selectedConnection ? selectedConnection.friends[this.state.selectedFriendIdx] : null;

    const renderTrusteeSet = (connection, connectionIdx) => {
      const color =
        connection.opinion
          ? trusteeColors[connectionIdx % trusteeColors.length]
          : 'lightgray';

      const renderTrustee = (friend, friendIdx) => {
        const trusteeView = (
          <TouchableHighlight
            key={connectionIdx + ':' + friendIdx}
            onPress={() => this.setState({ selectedConnectionIdx: connectionIdx, selectedFriendIdx: friendIdx })}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={[ { backgroundColor: color }, styles.circle ]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                { initials(friend) }
              </Text>
            </View>
          </TouchableHighlight>
        );
        if (connectionIdx === this.state.selectedConnectionIdx &&
            friendIdx === this.state.selectedFriendIdx) {
          return selectedCircle(trusteeView, connectionIdx + ':' + friendIdx);
        }
        return trusteeView;
      };

      return (
        connection.friends.map(renderTrustee)
      );
    };

    const renderBook = () => {
      return (
        <TouchableHighlight
          key='book'
          onPress={() => this.setState({ selectedConnectionIdx: this.state.bookIdx, selectedFriendIdx: 0, expanded: false })}
          style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={[ { backgroundColor: 'wheat' }, styles.circle ]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Icon style={{ marginRight: 2, marginTop: 3 }} name='book' size={27} color='black' />
            </View>
          </View>
        </TouchableHighlight>
      );
    };

    const renderExpand = () => {
      return (
        <TouchableHighlight
          key='book'
          onPress={() => this.setState({ expanded: true })}
          style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={[ { backgroundColor: 'wheat' }, styles.circle ]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Icon style={{ marginLeft: 12, marginTop: 2 }} name='chevron-left' size={28} color='black' />
            </View>
          </View>
        </TouchableHighlight>
      );
    };

    const renderAuthor = () => {
      if (!selectedConnection || !selectedConnection.author) {
        return [];
      }
      return (
        <View style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}>
          <View style={[ styles.circle, { backgroundColor: trusteeColors[this.state.selectedConnectionIdx % trusteeColors.length], marginRight: 0 } ]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              { initials(selectedFriend) }
            </Text>
          </View>
          <View style={{ height: 3, width: 40, backgroundColor: 'gray' }} />
          <View style={[ styles.circle, { backgroundColor: 'lightgray', marginLeft: 0, marginRight: 0 } ]} />
          <View style={{ height: 3, width: 40, backgroundColor: 'gray' }} />
          <View style={{ backgroundColor: 'lightgray', justifyContent: 'center', height: 40, borderRadius: 20 }}>
            <Text style={{ margin: 8, fontSize: 16, fontWeight: 'bold' }}>
              { selectedConnection.author.name }
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          { this.state.title }
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
        <View style={{
          height: 60,
          alignSelf: 'stretch',
          alignItems: 'center',
          borderTopColor: 'gray',
          borderTopWidth: 2,
          borderBottomColor: 'gray',
          borderBottomWidth: 2 }}>
          <ScrollView horizontal>
            { this.state.expanded
            ? this.state.connections.map(renderTrusteeSet)
            : renderExpand()
            }
            { this.state.selectedConnectionIdx === this.state.bookIdx
            ? selectedCircle(renderBook())
            : renderBook()
            }
            {/*
            <View style={{
              width: 50,
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
            */}
          </ScrollView>
        </View>
        { renderAuthor() }
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
        <ScrollView>
          <View style={styles.instructions}>
            <Markdown>
              { (selectedConnection ? (selectedConnection.opinion ? selectedConnection.opinion.text : '*...No connected opinion...*') : '') }
              {/* I see now. You want to see a UI widget in many possible states for the purposes of seeing a visual regression. (By "widget", I mean some piede of HTML generated by a function, not the loaded word "component", which usually implies state. Althought it could be either.) Without saying too much, I know there is some programmatic HTML-based testing in the pipeline but actually seeing the rendered output would be a nice complement to that. */}
            </Markdown>
          </View>
        </ScrollView>
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
    marginTop: 70
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
    // backgroundColor: 'orange'
  },
  instructions: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
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
