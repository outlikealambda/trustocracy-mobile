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
import { InitialsButton, IconButton } from './ElevatorButton.js';

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

    const renderTrusteeGroup = (connection, connectionIdx) => {
      const color =
        connection.opinion
          ? trusteeColors[connectionIdx % trusteeColors.length]
          : 'lightgray';

      const renderTrustee = (friend, friendIdx) => {
        const trusteeView = (
          <InitialsButton
            onPress={() => this.setState({
              selectedConnectionIdx: connectionIdx,
              selectedFriendIdx: friendIdx,
              selectedOpinion: null
            })}
            key={connectionIdx + ':' + friendIdx}
            backgroundColor={color}
            initials={initials(friend)} />
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

    const renderBook = () => (
      <IconButton
        name='book'
        key='book'
        backgroundColor='wheat'
        size={27}
        style={{marginRight: 2, marginTop: 3}}
        onPress={() => this.setState({
          selectedConnectionIdx: this.state.bookIdx,
          selectedFriendIdx: 0,
          expanded: false,
          selectedOpinion: null
        })} />
    );

    const renderExpand = () => (
      <IconButton
        name='chevron-left'
        key='expand'
        backgroundColor='wheat'
        size={28}
        style={{marginLeft: 12, marginTop: 2}}
        onPress={() => this.setState({ expanded: true })} />
    );

    const renderAuthorNavCircle = author => (
      <InitialsButton
        backgroundColor='wheat'
        initials={initials(author)} />
    );

    const renderOpinionHeader = () => {
      if (!selectedConnection || !selectedConnection.author) {
        return [];
      }

      return (
        <View style={{ height: 60, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <InitialsButton
            backgroundColor={trusteeColors[this.state.selectedConnectionIdx % trusteeColors.length]}
            initials={initials(selectedFriend)}
            style={{marginRight: 0}} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <Icon name='chevron-right' size={16} color='#999' />
          <View style={{ backgroundColor: 'lightgray', justifyContent: 'center', height: 40, borderRadius: 20, marginRight: 8 }}>
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
            ? this.state.connections.map(renderTrusteeGroup)
            : renderExpand()
            }
            { this.state.selectedConnectionIdx === this.state.bookIdx &&
              !this.state.selectedOpinion
            ? selectedCircle(renderBook())
            : renderBook()
            }
            { this.state.selectedConnectionIdx === this.state.bookIdx &&
              this.state.selectedOpinion
            ? selectedCircle(renderAuthorNavCircle(this.state.selectedOpinion.author))
            : <View />
            }
          </ScrollView>
        </View>
        {/* mark as a row, so that it will fill horizontally */}
        <View style={{flexDirection: 'row'}}>
          { renderOpinionHeader() }
        </View>
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
  },
  miniCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999'
  }
});
