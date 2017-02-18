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
  expanded: boolean,
  opinions: Array<any>,
  selectedOpinionIdx: number,
  selectedOpinion: any
};

const host = '127.0.0.1';

export class Topic extends Component<void, Props, State> {
  state: State

  static navigationOptions = {
    title: ({ state }) => 'Topic: ' + state.params.title
  }

  constructor (props: Props) {
    super(props);

    const topicId = this.props.navigation.state.params.id;

    this.state = {
      userId: 5,
      selectedConnectionIdx: 0,
      selectedFriendIdx: 0,
      bookIdx: 0,
      connections: [],
      title: '',
      expanded: true,
      opinions: [],
      selectedOpinionIdx: -1,
      selectedOpinion: null
    };

    global.fetch(`http://${host}:3714/api/topic/${topicId}/connected/${this.state.userId}`)
      .then(response => response.json())
      .then(connections => this.setState({ connections, bookIdx: connections.length }))
      .catch(error => {
        console.error(error);
      });

    global.fetch(`http://${host}:3714/api/topic/${topicId}`)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.setState({ title }))
      .catch(error => {
        console.error(error);
      });

    global.fetch(`http://${host}:3714/api/topic/${topicId}/opinion`)
      .then(response => response.json())
      .then(opinions => this.setState({ opinions }))
      .catch(error => {
        console.error(error);
      });
  }

  render () {
    const selectedConnection = this.state.connections[this.state.selectedConnectionIdx];
    const selectedFriend = selectedConnection ? selectedConnection.friends[this.state.selectedFriendIdx] : null;

    const fetchSelectedOpinion = opinionId => {
      global.fetch(`http://${host}:3714/api/opinion/${opinionId}`)
        .then(response => response.json())
        .then(opinion => this.setState({ selectedOpinion: opinion }))
        .catch(error => {
          console.error(error);
        });
    };

    const renderTrusteeSet = (connection, connectionIdx) => {
      const color =
        connection.opinion
          ? trusteeColors[connectionIdx % trusteeColors.length]
          : 'lightgray';

      const renderTrustee = (friend, friendIdx) => {
        const trusteeView = (
          <TouchableHighlight
            key={connectionIdx + ':' + friendIdx}
            onPress={() => this.setState({
              selectedConnectionIdx: connectionIdx,
              selectedFriendIdx: friendIdx,
              selectedOpinion: null })}
            style={{ justifyContent: 'center', alignItems: 'center' }}>
            {renderTrusteeInitials(color, initials(friend))}
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

    const renderTrusteeCircle = (bgColor, innerRendered, extraStyles) => (
      <View style={[styles.circle, {backgroundColor: bgColor}, extraStyles || {}]}>
        {innerRendered}
      </View>
    );

    const renderTrusteeInitials = (bgColor, initials, styles) => renderTrusteeCircle(
      bgColor,
      (<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{initials}</Text>),
      styles
    );

    const renderIcon = (name, size, style) => (
      <View style={{ backgroundColor: 'transparent' }}>
        <Icon style={style} name={name} size={27} color='black' />
      </View>
    );

    const renderBook = () => (
      <TouchableHighlight
        key='book'
        onPress={() => this.setState({
          selectedConnectionIdx: this.state.bookIdx,
          selectedFriendIdx: 0,
          expanded: false,
          selectedOpinion: null })}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        {renderTrusteeCircle('wheat', renderIcon('book', 27, {marginRight: 2, marginTop: 3}))}
      </TouchableHighlight>
    );

    const renderExpand = () => (
      <TouchableHighlight
        key='expand'
        onPress={() => this.setState({ expanded: true })}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        {renderTrusteeCircle('wheat', renderIcon('chevron-left', 28, {marginLeft: 12, marginTop: 2}))}
      </TouchableHighlight>
    );

    const renderAuthorCircle = author =>
      renderTrusteeInitials('wheat', initials(author));

    const renderAuthor = () => {
      if (!selectedConnection || !selectedConnection.author) {
        return [];
      }
      return (
        <View style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}>
          {renderTrusteeInitials(
            trusteeColors[this.state.selectedConnectionIdx % trusteeColors.length],
            initials(selectedFriend),
            {marginRight: 0}
          )}
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

    const renderOpinionSelector = (opinion, opinionIdx) => {
      return (
        <TouchableHighlight
          key={opinion.id}
          onPress={() => {
            fetchSelectedOpinion(opinion.id);
            this.setState({
              selectedOpinion: opinion,
              selectedOpinionIdx: opinionIdx
            });
          }}>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              { opinion.author.name + ' : ' + opinion.author.influence }
            </Text>
          </View>
        </TouchableHighlight>
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
            { this.state.selectedConnectionIdx === this.state.bookIdx &&
              !this.state.selectedOpinion
            ? selectedCircle(renderBook())
            : renderBook()
            }
            { this.state.selectedConnectionIdx === this.state.bookIdx &&
              this.state.selectedOpinion
            ? selectedCircle(renderAuthorCircle(this.state.selectedOpinion.author))
            : <View />
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
          { this.state.selectedConnectionIdx === this.state.bookIdx &&
            (!this.state.selectedOpinion || !this.state.selectedOpinion.text)
          ? this.state.opinions.map(renderOpinionSelector)
          : (
            <View style={styles.instructions}>
              <Markdown>
                { selectedConnection
                ? (selectedConnection.opinion
                  ? selectedConnection.opinion.text
                  : '*...No connected opinion...*'
                  )
                : (this.state.selectedOpinion
                  ? this.state.selectedOpinion.text
                  : ''
                  )
                }
                {/* I see now. You want to see a UI widget in many possible states for the purposes of seeing a visual regression. (By "widget", I mean some piede of HTML generated by a function, not the loaded word "component", which usually implies state. Althought it could be either.) Without saying too much, I know there is some programmatic HTML-based testing in the pipeline but actually seeing the rendered output would be a nice complement to that. */}
              </Markdown>
            </View>
            )
          }
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
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
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
