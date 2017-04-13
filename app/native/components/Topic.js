/**
 * @flow
 */

import React, { Component } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Markdown from 'react-native-simple-markdown';
import Icon from 'react-native-vector-icons/Octicons';
import { RoundedButton, InitialsButton, IconButton } from './Buttons.js';

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

// STATELESS RENDER FUNCTIONS

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

function renderPerson (person, color, pressAction, keyPrefix = 'p') {
  let trusteeView = (
    <InitialsButton
      shape={person.isRanked ? 'circle' : 'square'}
      onPress={pressAction}
      key={keyPrefix + person.id}
      backgroundColor={color}
      initials={initials(person)} />
  );

  if (person.isInfluencer) {
    trusteeView = influencerCircle(trusteeView, keyPrefix + 'influencer' + person.id);
  }

  return trusteeView;
}

function renderForNav ({dom, isSelected}) {
  const basicStyle = {
    width: 56,
    height: 68
  };

  const style = isSelected
    ? {
      borderBottomWidth: 4,
      borderBottomColor: 'orange'
    }
    : {};

  return (
    <View
      style={[basicStyle, style]}>
      {dom}
    </View>
  );
}

function renderOpinionSelector (opinionInfo, pressAction) {
  const {id, influence, author} = opinionInfo;

  return (
    <TouchableHighlight
      key={id}
      onPress={pressAction}>
      {
        twoCol(
          (
            <RoundedButton
              style={styles.roundedLeftHalf}
              text={author.name} />
          ),
          (
            <RoundedButton
              style={styles.roundedRightHalf}
              text={influence} />
          )
        )
      }
    </TouchableHighlight>
  );
}

function twoCol (first, second) {
  return (
    <View style={{ margin: 8, flexDirection: 'row' }}>
      <View style={{ flex: 5, alignItems: 'flex-end' }}>
        {first}
      </View>
      <View style={{ flex: 3, alignItems: 'flex-start' }}>
        {second}
      </View>
    </View>
  );
}

// END STATELESS RENDER FUNCTIONS

type Props = {
  id: string
}

type State = {
  topicId: number,
  userId: number,
  influence: number,
  connections: Array<any>,
  title: string,
  isBrowse : boolean,
  expanded: boolean,
  opinions: Array<any>,
  selectedOpinionIdx: number,
  selectedOpinion: any,
  showFriendDrawer: boolean,
  showAuthorDrawer: boolean
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
      topicId,
      userId: 2,
      influence: 0,
      selectedConnection: null,
      selectedFriend: null,
      connections: [],
      title: '',
      isBrowse: false,
      expanded: true,
      opinions: [],
      selectedOpinionIdx: -1,
      selectedOpinion: null,
      showFriendDrawer: false,
      showAuthorDrawer: false
    };

    this.fetchConnected(topicId, this.state.userId);
    this.fetchInfluence(topicId, this.state.userId);
    this.fetchTopicTitle(topicId);
    this.fetchOpinions(topicId);
  }

  fetchConnected = (topicId, userId) => {
    return global.fetch(`http://${host}:3714/api/topic/${topicId}/connected/${userId}`)
      .then(response => response.json())
      .then(connections => connections.map((connection, idx) => Object.assign(
        connection,
        {
          color: trusteeColors[idx % trusteeColors.length]
        }
      )))
      .then(connections => {
        this.animateStateChange({ connections });
        return connections;
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchInfluence = (topicId, userId) => {
    return global.fetch(`http://${host}:3714/api/topic/${topicId}/user/${userId}/influence`)
      .then(response => response.json())
      .then(r => this.animateStateChange({ influence: r.influence }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchTopicTitle = topicId => {
    return global.fetch(`http://${host}:3714/api/topic/${topicId}`)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.animateStateChange({ title }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchOpinions = topicId => {
    return global.fetch(`http://${host}:3714/api/topic/${topicId}/opinions`)
      .then(response => response.json())
      .then(opinions => this.animateStateChange({ opinions }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchSelectedOpinion = opinionId => {
    return global.fetch(`http://${host}:3714/api/opinion/${opinionId}`)
      .then(response => response.json())
      .catch(error => {
        console.error('failed to retrieve opinion with id: ' + opinionId, error);
        throw error;
      });
  }

  fetchSetTarget = (topicId, userId, targetId) => {
    return global.fetch(`http://${host}:3714/api/topic/${topicId}/user/${userId}/target/${targetId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'plain/text'
        },
        body: ''
      })
      .then(() => this.syncState(topicId, userId));
  }

  // When an action occurs which could change influence, we need to sync
  // up with the server
  syncState = (topicId, userId) => {
    Promise.all([
      this.fetchConnected(topicId, userId),
      this.fetchInfluence(topicId, userId),
      this.fetchOpinions(topicId)
    ]).then(results => {
      const [connections] = results;
      const selectedConnection = this.findSelectedConnection(connections);
      const selectedFriend = this.findSelectedFriend(selectedConnection);

      this.animateStateChange({
        selectedConnection,
        selectedFriend
      });
    });
  }

  findSelectedConnection = (connections) => {
    const authorId = this.state.selectedConnection &&
      this.state.selectedConnection.author &&
      this.state.selectedConnection.author.id ||
      -1;

    return connections.find(c => c.author.id === authorId);
  }

  findSelectedFriend = connection => {
    const friendId = this.state.selectedFriend ? this.state.selectedFriend.id : -1;

    return connection.friends.find(f => f.id === friendId);
  }

  toggleFriendDrawer = () => {
    this.animateStateChange({
      showAuthorDrawer: false,
      showFriendDrawer: !this.state.showFriendDrawer
    });
  }

  toggleAuthorDrawer = () => {
    this.animateStateChange({
      showFriendDrawer: false,
      showAuthorDrawer: !this.state.showAuthorDrawer
    });
  }

  showBrowseAllOpinions = () => {
    this.animateStateChange(Object.assign(
      {
        isBrowse: true,
        selectedFriendId: -1,
        expanded: false,
        selectedOpinion: null
      },
      defaultState.hiddenDrawers
    ));
  }

  showBrowseSingleOpinion = opinionId => () => {
    this.fetchSelectedOpinion(opinionId)
      .then(selectedOpinion => {
        this.animateStateChange({
          selectedOpinion,
          opinionId
        });
      });
  }

  showConnectedOpinion = (selectedConnection, selectedFriend) => () => {
    this.animateStateChange(Object.assign(
      {
        isBrowse: false,
        selectedOpinion: null,
        selectedConnection,
        selectedFriend
      },
      defaultState.hiddenDrawers
    ));
  }

  showTrusteeIcons = () => {
    this.animateStateChange({
      expanded: true
    });
  }

  animateStateChange = modifiedState => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState);
  }

  isSelectedFriend (person) {
    return this.state.selectedFriend && this.state.selectedFriend.id === person.id;
  }

  render () {
    const renderTrusteeGroup = connection => {
      const color =
        connection.opinion
          ? connection.color
          : 'lightgray';

      return (
        connection.friends
          .map(friend => ({
            dom: renderPerson(
              friend,
              color,
              this.showConnectedOpinion(connection, friend, friend.id)
            ),
            isSelected: this.isSelectedFriend(friend)
          }))
          .map(renderForNav)
      );
    };

    const renderBook = () => (
      <IconButton
        shape='circle'
        name='book'
        key='book'
        backgroundColor='wheat'
        size={27}
        style={{marginRight: 2, marginTop: 3}}
        onPress={this.showBrowseAllOpinions} />
    );

    const renderExpand = () => (
      <IconButton
        shape='circle'
        name='chevron-left'
        key='expand'
        backgroundColor='wheat'
        size={28}
        style={{marginLeft: 12, marginTop: 2}}
        onPress={this.showTrusteeIcons} />
    );

    const renderAuthorNavCircle = author => (
      <InitialsButton
        shape='circle'
        backgroundColor='wheat'
        initials={initials(author)} />
    );

    const renderOpinionHeader = () => {
      if (!this.state.selectedConnection || !this.state.selectedFriend) {
        return [];
      }

      const friend = this.state.selectedFriend;
      const {author, color: friendColor} = this.state.selectedConnection;

      const trusteeCircle = renderPerson(
        friend,
        friendColor,
        this.toggleFriendDrawer
      );

      if (author) {
        const authorSquare = renderPerson(
          author,
          author.isRanked || author.isManual ? friendColor : '#ccc',
          this.toggleAuthorDrawer,
          'author'
        );

        const influenceSquare =
          <View
            style={{
              height: 40,
              marginVertical: 8,
              marginLeft: -8,
              paddingHorizontal: 8,
              borderWidth: 1,
              borderColor: '#ccc',
              justifyContent: 'center'
            }}
            >
            <Text
              style={{
                fontSize: 14
              }}
              >
              <Bold>{this.state.selectedConnection.influence}</Bold> pts
            </Text>
          </View>;

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
            <View
              style={{
                flexDirection: 'row',
                flex: 0
              }}>
              { authorSquare }
              { influenceSquare }
            </View>
          </View>
        );
      } else {
        return (
          <View style={{padding: 8}}>
            { trusteeCircle }
          </View>
        );
      }
    };

    const Bold = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

    const renderDrawer = (person, influence) => {
      if (!person) return [];

      if (person.isManual) {
        return (
          <View style={styles.drawer}>
            <Text style={[styles.drawerRow, {backgroundColor: 'lightgreen', paddingVertical: 16}]}>
              <Bold>{person.name}</Bold> is your delegate!{'\n'}
              You have passed on <Bold>+{influence}pts</Bold> of influence
            </Text>
            <View style={[styles.drawerRow, styles.drawerTop, styles.drawerRowWrapper, {marginLeft: 0}]}>
              <RoundedButton
                text={'Remove'}
                size={'small'}
                onPress={() => console.log('remove!')}
                style={{backgroundColor: '#aaa', marginRight: 6}}
              />
              <Text style={{flex: 1}}>
                <Bold>{person.name}</Bold> as my delegate
              </Text>
            </View>
            <Text style={[styles.drawerRow, styles.drawerBottom, {fontSize: 12, fontStyle: 'italic'}]}>
              {`This will redirect your influence to your top-ranked friend`}
            </Text>
          </View>
        );
      }

      if (person.isInfluencer) {
        return (
          <View style={styles.drawer}>
            <Text style={[styles.drawerRow, {backgroundColor: 'lightgreen', padding: 16}]} >
              <Bold>{person.name}</Bold> is your default delegate!{'\n'}
              You have passed on <Bold>+{influence}pts</Bold> of influence
            </Text>
          </View>
        );
      }

      const setDelegate = () => this.fetchSetTarget(this.state.topicId, this.state.userId, person.id);

      if (person.isRanked) {
        return (
          <View style={styles.drawer}>
            <View style={[styles.drawerRow, styles.drawerTop, styles.drawerBottom, styles.drawerRowWrapper]}>
              <RoundedButton
                text={'Delegate'}
                onPress={setDelegate}
                style={{backgroundColor: 'lightgreen', marginRight: 4}}
              />
              <Text style={{flex: 1}}>
                <Bold>+{influence}pts</Bold> of influence to {person.name}
              </Text>
            </View>
          </View>
        );
      }

      // we're left with an unconnected author
      return (
        <View style={styles.drawer}>
          <View style={[styles.drawerRow, styles.drawerRowWrapper, styles.drawerTop]}>
            <RoundedButton
              text={'Delegate Directly'}
              onPress={setDelegate}
              style={{backgroundColor: 'lightgreen', marginRight: 4}}
            />
            <Text style={{flex: 1}}>to {person.name}</Text>
          </View>
          <Text style={[styles.drawerRow, styles.drawerBottom, {fontSize: 12, fontStyle: 'italic'}]}>
            {
              `Can you personally vouch for ${person.name}, or are you an expert` +
              ` in this topic and able to confirm the claims in this article? If` +
              ` not, consider delegating to a friend who knows more about this` +
              ` topic`
            }
          </Text>
        </View>
      );
    };

    const renderBrowseOpinions = opinions => {
      return (
        <View style={{paddingVertical: 12}}>
          {twoCol(
            (<Text style={[styles.browseHeader, {marginRight: 8}]}>Author</Text>),
            (<Text style={[styles.browseHeader, {marginLeft: 8}]}>Influence</Text>)
          )}
          {opinions.map(opinion => renderOpinionSelector(opinion, this.showBrowseSingleOpinion(opinion.id)))}
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 12,
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
            : renderForNav({dom: renderExpand(), isSelected: false})
            }
            { this.state.isBrowse &&
              !this.state.selectedOpinion
            ? renderForNav({dom: renderBook(), isSelected: true})
            : renderForNav({dom: renderBook(), isSelected: false})
            }
            { this.state.isBrowse &&
              this.state.selectedOpinion
            ? renderForNav({dom: renderAuthorNavCircle(this.state.selectedOpinion.author), isSelected: true})
            : []
            }
          </ScrollView>
        </View>
        {/* mark as a row, so that it will fill horizontally */}
        <View style={{flex: 0, flexDirection: 'row'}}>
          {!this.state.isBrowse ? renderOpinionHeader() : []}
        </View>
        {this.state.showFriendDrawer ? renderDrawer(this.state.selectedFriend, this.state.influence) : []}
        {this.state.showAuthorDrawer ? renderDrawer(this.state.selectedConnection ? this.state.selectedConnection.author : {}, this.state.influence) : []}
        <View style={{flex: 1}}>
          <ScrollView>
            { this.state.isBrowse &&
              (!this.state.selectedOpinion || !this.state.selectedOpinion.text)
            ? renderBrowseOpinions(this.state.opinions)
            : (
              <View style={styles.instructions} key={this.state.selectedConnection ? this.state.selectedConnection.id : 0}>
                <Markdown>
                  { this.state.selectedConnection
                  ? (this.state.selectedConnection.opinion
                    ? this.state.selectedConnection.opinion.text
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

const defaultState = {
  hiddenDrawers: {
    showAuthorDrawer: false,
    showFriendDrawer: false
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
  roundedLeftHalf: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ccc'
  },
  roundedRightHalf: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: 'pink'
  },
  miniCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999'
  },
  browseHeader: {
    fontSize: 14,
    color: '#999'
  },
  drawer: {
    flex: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#ddd'
  },
  drawerTop: {
    paddingTop: 12
  },
  drawerBottom: {
    paddingBottom: 12
  },
  drawerRow: {
    paddingHorizontal: 16,
    paddingVertical: 6
  },
  drawerRowWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
