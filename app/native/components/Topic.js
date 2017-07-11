/**
 * @flow
 */

import React, { Component } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Markdown from 'react-native-simple-markdown';
import { Octicons } from '@expo/vector-icons';
import { DelegateIcon } from './delegate/Delegate.js';
import { RoundedButton, IconButton, Sizes } from './Buttons.js';
import { TopicInfo } from './TopicInfo.js';
import * as Api from './api';
import * as Metric from './Metric.js';
import * as Person from './Person.js';

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

// STATELESS RENDER FUNCTIONS
function Bold (props) {
  return (<Text style={{fontWeight: 'bold'}}>{props.children}</Text>);
}

function renderForNav ({dom, isSelected}) {
  const basicStyle = {
    paddingBottom: 4
  };

  const selectedStyle = isSelected
    ? {
      borderBottomWidth: 4,
      borderBottomColor: 'orange'
    }
    : { marginBottom: 4 };

  return (
    <View
      style={[basicStyle, selectedStyle]}>
      {dom}
    </View>
  );
}

// END STATELESS RENDER FUNCTIONS

// STATELESS HELPER FUNCTIONS

function findInfluencerConnectionCombo (connections) {
  for (let i = 0; i < connections.length; i++) {
    for (let j = 0; j < connections[i].friends.length; j++) {
      if (connections[i].friends[j].isInfluencer) {
        return {
          connection: connections[i],
          friend: connections[i].friends[j]
        };
      }
    }
  }

  return {};
}

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
  opinions: Array<any>,
  prompts: Array<any>,
  promptIdx: number,
  selectedOpinionIdx: number,
  selectedOpinion: any,
  showFriendDrawer: boolean,
  showAuthorDrawer: boolean
};

export class Topic extends Component<void, Props, State> {
  state: State

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerRight: DelegateIcon(navigation.navigate)
  })

  constructor (props: Props) {
    super(props);

    const topicId = this.props.navigation.state.params.id;
    const prompts = this.props.navigation.state.params.prompts;

    this.state = {
      topicId,
      prompts,
      userId: 2,
      influence: 0,
      selectedConnection: null,
      selectedFriend: null,
      connections: [],
      title: '',
      isBrowse: false,
      opinions: [],
      promptIdx: 0,
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
    return Api.connected(topicId, userId)
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
        console.error('fetch connected error', error);
        throw error;
      });
  }

  fetchInfluence = (topicId, userId) => {
    return Api.influence(topicId, userId)
      .then(response => response.json())
      .then(r => this.animateStateChange({ influence: r.influence }))
      .catch(error => {
        console.error('fetch influence error', error);
        throw error;
      });
  }

  fetchTopicTitle = topicId => {
    return Api.topicTitle(topicId)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.animateStateChange({ title }))
      .catch(error => {
        console.error('fetch topic title', error);
        throw error;
      });
  }

  fetchOpinions = topicId => {
    return Api.opinions(topicId)
      .then(response => response.json())
      .then(opinions => this.animateStateChange({ opinions }))
      .catch(error => {
        console.error('fetch opinions error', error);
        throw error;
      });
  }

  updatePrompt = promptIdx => {
    this.animateStateChange({promptIdx});
  }

  fetchSelectedOpinion = opinionId => {
    return Api.opinion(opinionId)
      .then(response => response.json())
      .catch(error => {
        console.error('failed to retrieve opinion with id: ' + opinionId, error);
        throw error;
      });
  }

  fetchSetTarget = (topicId, userId, targetId) => {
    return Api.target.set(topicId, userId, targetId)
      .then(() => this.syncState(topicId, userId));
  }

  fetchClearTarget = (topicId, userId) => {
    return Api.target.clear(topicId, userId)
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
        selectedFriend: null,
        selectedConnection: null,
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

  animateStateChange = (modifiedState, callback = () => {}) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState, callback);
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
            dom: (
              <Person.Button
                person={
                  Object.assign({color}, friend)
                }
                pressAction={this.showConnectedOpinion(connection, friend)}
              />
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
        iconStyle={{fontSize: 27, height: 27, width: 27, marginRight: 1}}
        onPress={this.showBrowseAllOpinions} />
    );

    const renderConnectionHeader = () => {
      if (!this.state.selectedConnection || !this.state.selectedFriend) {
        return [];
      }

      const friend = this.state.selectedFriend;
      const {author, color: friendColor, influence} = this.state.selectedConnection;

      return (
        <FriendAuthorConnection
          friend={
            friend && Object.assign({color: friendColor}, friend)
          }
          author={
            author && Object.assign({influence}, author)
          }
        />
      );
    };

    const renderBrowsedHeader = () => {
      if (!this.state.selectedOpinion) {
        return [];
      }

      const {author, influence} = this.state.selectedOpinion;

      return (
        <FriendAuthorConnection
          author={
            Object.assign({influence}, author)
          }
        />
      );
    };

    const FriendAuthorConnection = ({friend, author}) => {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 8
          }}>
          { friend &&
            <Person.Button
              person={friend}
              pressAction={this.toggleFriendDrawer}
            />
          }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <View style={[styles.miniCircle]} /> }
          { friend && author && <Octicons name='chevron-right' size={20} color='#999' /> }
          { author &&
            <Person.Button
              person={Object.assign(
                {
                  color: author.isRanked || author.isManual ? friend.color : '#ccc'
                },
                author
              )}
              pressAction={this.toggleAuthorDrawer}
              influence={author.influence}
              />
          }
        </View>
      );
    };

    const renderTopicInfo = (influence, connections) => {
      if (!connections.length) {
        return null;
      }

      const found = findInfluencerConnectionCombo(connections);
      const {friend: activeInfluencer, connection: activeConnection} = found;

      return (
        <TopicInfo
          influence={influence}
          delegate={
            <Person.Button
              person={Object.assign(
                {color: 'pink'},
                activeInfluencer
              )}
              pressAction={this.showConnectedOpinion(activeConnection, activeInfluencer)}
            />
          }
          />
      );
    };

    const renderDrawer = (person, influence) => {
      if (!person) return [];

      const setDelegate = () => this.fetchSetTarget(this.state.topicId, this.state.userId, person.id);
      const clearDelegate = () => this.fetchClearTarget(this.state.topicId, this.state.userId);

      if (person.isManual) {
        return (
          <View style={styles.drawer}>
            <Text style={[styles.drawerRow, {backgroundColor: 'lightgreen', paddingVertical: 16}]}>
              <Bold>{person.name}</Bold> is your delegate!{'\n'}
              You have passed on <Bold>+{influence}pts</Bold> of influence
            </Text>
            <View style={[styles.drawerRow, styles.drawerTop, styles.drawerRowWrapper, {marginLeft: 0}]}>
              <RoundedButton
                text='Remove'
                size='small'
                onPress={clearDelegate}
                buttonStyle={{backgroundColor: '#aaa', marginRight: 6}}
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

      if (person.isRanked) {
        return (
          <View style={styles.drawer}>
            <View style={[styles.drawerRow, styles.drawerTop, styles.drawerBottom, styles.drawerRowWrapper]}>
              <RoundedButton
                text={'Delegate'}
                onPress={setDelegate}
                buttonStyle={{backgroundColor: 'lightgreen', marginRight: 4}}
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
              buttonStyle={{backgroundColor: 'lightgreen', marginRight: 4}}
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

    const answerTile = {
      marginHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center'
    };

    const renderScalarAnswer = value => {
      const height = 14;
      const goesLeft = value < 0.5;
      const width = Math.abs(value - 0.51) * 100 / 1;
      const left = goesLeft ? value * 100 / 1 : 51;
      const cornerRadius = 6;

      const style = {
        position: 'absolute',
        left: left + '%',
        width: width + '%',
        height,
        borderBottomLeftRadius: goesLeft ? cornerRadius : 0,
        borderTopLeftRadius: goesLeft ? cornerRadius : 0,
        borderBottomRightRadius: goesLeft ? 0 : cornerRadius,
        borderTopRightRadius: goesLeft ? 0 : cornerRadius,
        backgroundColor: goesLeft ? 'blue' : 'orange'
      };

      return (
        <View
          style={[
            styles.scalarAnswer,
            answerTile,
            {
              position: 'relative',
              flex: 1
            }
          ]}>
          <View style={style} />
          <View style={{
            position: 'absolute',
            left: '49%',
            width: '2%',
            height: 28,
            backgroundColor: '#ccc'
          }} />
        </View>
      );
    };

    const renderAnswers = (answer, prompt) => {
      const {selected, value} = answer;

      return (
        Metric.isScalar(prompt)
        ? renderScalarAnswer(value)
        : (
          <View
            style={[styles.multipleChoiceAnswer, answerTile]}>
            <Text>{prompt.options[selected].text}</Text>
          </View>
        )
      );
    };

    const smallIcon = {
      fontSize: 20,
      height: 20,
      width: 10
    };

    const renderChevron = (isDisabled, leftRight, updateFn) =>
      isDisabled
        ? renderDisabledChevron(leftRight)
        : renderEnabledChevron(leftRight, updateFn);

    const renderDisabledChevron = leftRight => (
      <IconButton
        size={Sizes.SMALL}
        shape='circle'
        name={'chevron-' + leftRight}
        key={leftRight}
        iconStyle={smallIcon}
        color='#ccc'
        backgroundColor='#efefef'
        onPress={() => {}} />
    );

    const renderEnabledChevron = (leftRight, updateFn) => (
      <IconButton
        size={Sizes.SMALL}
        shape='circle'
        name={'chevron-' + leftRight}
        key={leftRight}
        iconStyle={smallIcon}
        color='#444'
        backgroundColor='#ddd'
        onPress={updateFn} />
    );

    const renderPrompt = (prompts, promptIdx, updateFn) => {
      const prompt = prompts[promptIdx];
      const isFirst = promptIdx === 0;
      const isLast = promptIdx === prompts.length - 1;

      return (
        // prompts row
        <View
          key='prompt'
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 40,
            marginLeft: 40,
            marginVertical: 16,
            minHeight: 80,
            flex: 1
          }}>
          {
            renderChevron(isFirst, 'left', () => updateFn(promptIdx - 1))
          }
          <Text
            style={{
              flex: 1,
              fontSize: 18,
              textAlign: 'center',
              paddingHorizontal: 8
            }}>
            {prompt.text}
          </Text>
          {
            renderChevron(isLast, 'right', () => updateFn(promptIdx + 1))
          }
        </View>
      );
    };

    const renderBrowseOpinions = (opinions, prompts, promptIdx, updatePromptFn) => {
      return (
        <ScrollView>
          <View style={{paddingVertical: 12}}>
            {renderPrompt(prompts, promptIdx, updatePromptFn)}
            {
              opinions.map(
                opinion => (
                  <View
                    key={opinion.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 8
                    }}>
                    <Person.Button
                      person={
                        Object.assign({color: '#ccc'}, opinion.author)
                      }
                      pressAction={this.showBrowseSingleOpinion(opinion.id)}
                      influence={opinion.influence}
                      />
                    <View
                      style={[styles.answers, {paddingRight: 48}]}>
                      {
                        renderAnswers(opinion.answers[promptIdx], prompts[promptIdx])
                      }
                    </View>
                  </View>
                )
              )
            }
          </View>
        </ScrollView>
      );
    };

    const renderOpinionText = (opinion, defaultText = '') => (
      <ScrollView>
        <View style={styles.instructions}>
          <Markdown>
            { opinion
              ? opinion.text
              : defaultText
            }
          </Markdown>
        </View>
      </ScrollView>
    );

    const renderBody = state => {
      if (state.isBrowse) {
        return state.selectedOpinion && state.selectedOpinion.text
          ? renderOpinionText(state.selectedOpinion)
          : renderBrowseOpinions(state.opinions, state.prompts, state.promptIdx, this.updatePrompt);
      } else {
        return state.selectedConnection && state.selectedConnection.opinion
          ? renderOpinionText(state.selectedConnection.opinion)
          : renderTopicInfo(state.influence, state.connections);
      }
    };

    return (
      <View style={styles.container}>

        {/* NAVIGATION */}
        <View
          style={styles.selectorIconRow}>
          { /* ScrollView needs a height; either inherited or set, and even
               if it's horizontal */}
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollInterior}>
            { this.state.connections.map(renderTrusteeGroup) }
            { renderForNav({dom: renderBook(), isSelected: this.state.isBrowse}) }
          </ScrollView>
        </View>

        {/* BODY */}
        {/* mark as a row, so that it will fill horizontally */}
        <View style={{flex: 0, flexDirection: 'row'}}>
          {!this.state.isBrowse ? renderConnectionHeader() : renderBrowsedHeader() }
        </View>
        {this.state.showFriendDrawer ? renderDrawer(this.state.selectedFriend, this.state.influence) : []}
        {this.state.showAuthorDrawer ? renderDrawer(this.state.selectedConnection ? this.state.selectedConnection.author : {}, this.state.influence) : []}
        <View style={{flex: 1}}>
          { renderBody(this.state) }
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
  selectorIconRow: {
    marginTop: 12,
    height: 84
  },
  scrollInterior: {
    alignItems: 'center',
    paddingHorizontal: 8
  },
  instructions: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 5
  },
  miniCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999'
  },

  // drawers
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
  },

  // prompts
  answers: {
    flexDirection: 'row',
    flex: 1
  },
  scalarAnswer: {
    // width: 80
  },
  multipleChoiceAnswer: {
  }
});
