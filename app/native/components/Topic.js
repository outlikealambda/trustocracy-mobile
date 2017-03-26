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
        borderWidth: 2,
        borderColor: 'orange'
      }}>
      {content}
    </View>
  );
}

function influencerCircle (content, key) {
  return (
    <View
      key={key}
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'turquoise'
      }}>
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
        let trusteeView = (
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
          trusteeView = selectedCircle(trusteeView, 'selected' + connectionIdx + ':' + friendIdx);
        }

        if (friend.isInfluencer) {
          trusteeView = influencerCircle(trusteeView, 'influencer' + connectionIdx + ':' + friendIdx);
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

      let trusteeCircle = (
        <InitialsButton
          backgroundColor={trusteeColors[this.state.selectedConnectionIdx % trusteeColors.length]}
          initials={initials(selectedFriend)}
          style={{
            marginHorizontal: selectedFriend.isInfluencer ? 0 : 8
          }} />
      );

      if (selectedFriend.isInfluencer) {
        trusteeCircle = influencerCircle(trusteeCircle);
      }

      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 8
          }}>
          { trusteeCircle }
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <View style={[styles.miniCircle]} />
          <Icon name='chevron-right' size={16} color='#999' />
          <View style={[styles.roundedContainer, { backgroundColor: 'lightgray', marginRight: 8 }]}>
            <Text style={{ margin: 8, marginLeft: 12, marginRight: 12, fontSize: 16, fontWeight: 'bold' }}>
              { selectedConnection.author.name }
            </Text>
          </View>
        </View>
      );
    };

    const renderOpinionSelector = (opinion, opinionIdx) => {
      const fontStyle = {
        fontSize: 16,
        fontWeight: 'bold',
        margin: 8,
        marginLeft: 12,
        marginRight: 12
      };

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
          <View style={{ flexDirection: 'row', margin: 8, justifyContent: 'center' }}>
            <View style={[styles.roundedLeftHalf, { backgroundColor: 'lightgray', marginRight: 8 }]}>
              <Text style={fontStyle}>
                { opinion.author.name }
              </Text>
            </View>
            <View style={[styles.roundedRightHalf, { backgroundColor: 'pink' }]}>
              <Text style={fontStyle}>
                { opinion.author.influence }
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          { this.state.title }
        </Text>
        <View
          style={{
            alignSelf: 'stretch',
            alignItems: 'center',
            borderTopColor: '#ddd',
            borderTopWidth: 1,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            height: 70
          }}>
          { /* ScrollView needs a height; either inherited or set, and even
               if it's horizontal */}
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: 'center',
              paddingHorizontal: 8
            }}>
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
        <View style={{flex: 0, flexDirection: 'row'}}>
          { renderOpinionHeader() }
        </View>
        <View style={{flex: 1}}>
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
                </Markdown>
              </View>
              )
            }
          </ScrollView>
        </View>
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
    flex: 0,
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
  roundedContainer: {
    justifyContent: 'center',
    height: 40,
    borderRadius: 20
  },
  roundedLeftHalf: {
    height: 40,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
  },
  roundedRightHalf: {
    height: 40,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20
  },
  miniCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999'
  }
});
