import React, { Component } from 'react';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import Markdown from 'react-native-simple-markdown';
import { DelegateIcon } from '../delegate/Delegate.js';
import { IconButton, Sizes } from '../Buttons.js';
import { TopicInfo } from './TopicInfo.js';
import { Connection } from './Connection.js';
import * as Api from '../api';
import * as Metric from '../Metric.js';
import * as Person from '../Person.js';

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
const NavWrapper = props => {
  const basicStyle = {
    marginHorizontal: 4,
    paddingBottom: 4
  };

  // console.log(props);

  const selectedStyle = props.isSelected
    ? {
        borderBottomWidth: 4,
        borderBottomColor: 'orange'
      }
    : { marginBottom: 4 };

  return (
    <View style={[basicStyle, selectedStyle]}>
      {props.children}
    </View>
  );
};

NavWrapper.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

// END STATELESS RENDER FUNCTIONS

// STATELESS HELPER FUNCTIONS

function findInfluencerConnectionCombo(connections) {
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

  return null;
}

const Relations = {
  extractFromConnections: connections =>
    connections.reduce(
      (agg, conn) => agg.concat(conn.friends, conn.author ? [conn.author] : []),
      []
    ),
  opinionMerger: relations => opinion => {
    const relatedPerson = relations.find(rel => rel.id === opinion.author.id);

    return !relatedPerson
      ? opinion
      : Object.assign(opinion, { author: relatedPerson });
  },
  connection: {
    setValue(connection, newValue) {
      const author =
        connection.author && Object.assign(connection.author, newValue);
      const friends = connection.friends.map(f => Object.assign(f, newValue));

      return Object.assign({}, connection, {
        author,
        friends
      });
    },
    setColor(connection, color) {
      return this.setValue(connection, { color });
    },
    setIsConnected(connection) {
      return this.setValue(connection, { isConnected: !!connection.author });
    }
  }
};

const Connections = {
  setColors(connections) {
    return connections.map((connection, idx) =>
      Relations.connection.setColor(
        connection,
        trusteeColors[idx % trusteeColors.length]
      )
    );
  },

  setIsConnected(connections) {
    return connections.map(connection =>
      Relations.connection.setIsConnected(connection)
    );
  },

  // Just moves influence onto Opinion for now
  normalize(connection) {
    const opinion =
      connection.opinion &&
      Object.assign({}, connection.opinion, {
        influence: connection.influence
      });

    return Object.assign(
      {},
      connection,
      { influence: null },
      {
        opinion
      }
    );
  },
  normalizeAll(connections) {
    return connections.map(this.normalize);
  }
};

// END STATELESS HELPER FUNCTIONS

type Props = {
  id: string
};

type State = {
  topicId: number,
  userId: number,
  influence: number,
  connections: Array<any>,
  title: string,
  isBrowse: boolean,
  opinions: Array<any>,
  prompts: Array<any>,
  promptIdx: number,
  showFriendDrawer: boolean,
  showAuthorDrawer: boolean
};

export class Topic extends Component<void, Props, State> {
  state: State;

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerRight: DelegateIcon(navigation.navigate)
  });

  constructor(props: Props) {
    super(props);

    const topicId = this.props.navigation.state.params.id;
    const prompts = this.props.navigation.state.params.prompts;

    this.state = {
      topicId,
      prompts,
      userId: 682,
      influence: 0,
      connections: [],
      allRelations: [],
      title: '',
      isBrowse: false,
      opinions: [],
      promptIdx: 0,
      showFriendDrawer: false,
      showAuthorDrawer: false,
      visibleFriend: null,
      visibleAuthor: null,
      visibleOpinion: null
    };

    this.syncState(topicId, this.state.userId);
    this.fetchTopicTitle(topicId);
  }

  isTopicInfo = () => {
    return (
      !this.state.isBrowse &&
      !this.state.visibleFriend &&
      !this.state.visibleAuthor
    );
  };

  isNoConnectedOpinionToFriend = () => {
    return (
      !this.state.isBrowse &&
      this.state.visibleFriend &&
      !this.state.visibleOpinion
    );
  };

  fetchConnected = (topicId, userId) => {
    return Api.connected(topicId, userId)
      .then(response => response.json())
      .then(connections => Connections.normalizeAll(connections))
      .then(connections => Connections.setColors(connections))
      .then(connections => Connections.setIsConnected(connections))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('fetch connected error', error);
        throw error;
      });
  };

  fetchInfluence = (topicId, userId) => {
    return Api.influence(topicId, userId)
      .then(response => response.json())
      .then(r => r.influence)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('fetch influence error', error);
        throw error;
      });
  };

  fetchOpinions = topicId => {
    return Api.opinions(topicId)
      .then(response => response.json())
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('fetch opinions error', error);
        throw error;
      });
  };

  // This is used when
  // - An action occurs which could change influence, we need to sync up with the server
  // - Initial screen load
  syncState = (topicId, userId, targetId = null) => {
    Promise.all([
      this.fetchConnected(topicId, userId),
      this.fetchInfluence(topicId, userId),
      this.fetchOpinions(topicId)
    ]).then(results => {
      const [connections, influence, opinionsSansRelationships] = results;

      const allRelations = Relations.extractFromConnections(connections);
      const opinions = opinionsSansRelationships.map(
        Relations.opinionMerger(allRelations)
      );

      // TODO: visibleState doesn't need to be evaluated on initial screen load
      const visibleState = this.evaluateVisibleState(
        connections,
        opinions,
        targetId
      );

      this.animateStateChange(
        Object.assign(
          {
            allRelations,
            connections,
            influence,
            opinions
          },
          visibleState
        )
      );
    });
  };

  fetchTopicTitle = topicId => {
    return Api.topicTitle(topicId)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.animateStateChange({ title }))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('fetch topic title', error);
        throw error;
      });
  };

  updatePrompt = promptIdx => {
    this.animateStateChange({ promptIdx });
  };

  fetchSelectedOpinion = opinionId => {
    return Api.opinion(opinionId)
      .then(response => response.json())
      .then(Relations.opinionMerger(this.state.allRelations))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(
          'failed to retrieve opinion with id: ' + opinionId,
          error
        );
        throw error;
      });
  };

  fetchSetTarget = (topicId, userId) => targetId => () => {
    return Api.target
      .set(topicId, userId, targetId)
      .then(() => this.syncState(topicId, userId, targetId));
  };

  fetchClearTarget = (topicId, userId) => () => {
    return Api.target
      .clear(topicId, userId)
      .then(() =>
        this.syncState(
          topicId,
          userId,
          this.state.visibleFriend && this.state.visibleFriend.id
        )
      );
  };

  evaluateVisibleState = (connections, opinions, targetId) => {
    // if no targetId, try use previous visible friend id
    targetId =
      targetId || (this.state.visibleFriend && this.state.visibleFriend.id);

    // check connections: for loop == .find + .map
    for (let i = 0; i < connections.length; i++) {
      for (let j = 0; j < connections[i].friends.length; j++) {
        let friend = connections[i].friends[j];

        // friend.id match: set friend, opinion and author
        if (friend.id === targetId) {
          return {
            visibleFriend: friend,
            visibleAuthor: connections[i].author,
            visibleOpinion: connections[i].opinion,
            showAuthorDrawer: false
          };
        }
      }

      let author = connections[i].author;

      // author.id match: set friend = friends[0], opinion and author
      // TODO: remove {showFriendDrawer: false} when we no longer display
      // identical friend and author buttons
      if (author && author.id === targetId) {
        return {
          visibleFriend: connections[i].friends[0],
          visibleAuthor: author,
          visibleOpinion: connections[i].opinion,
          showFriendDrawer: false
        };
      }
    }

    const opinionMetadata = opinions.find(
      opinion => opinion.author.id === targetId
    );

    // opinion.author.id match: set friend = null, opinion and author
    if (opinionMetadata) {
      // Uhhh, I'm going to assume that if we got here, it's because
      // we had a manual connection to a browsed opinion, and that connection
      // was removed.  I _think_ this is a valid assumption, and we can leave
      // the opinion text as is (because we don't get back the text when
      // fetching all the opinions via the api)
      // We could also just fetch this specific opinion again here?
      const { author, influence } = opinionMetadata;
      const opinion = this.state.visibleOpinion;

      opinion.influence = influence;

      return {
        visibleFriend: null,
        visibleAuthor: author,
        visibleOpinion: opinion,
        showFriendDrawer: false
      };
    }

    // default: opinion has been deleted? set friend=null, opinion=null, author=null
    return {
      visibleFriend: null,
      visibleAuthor: null,
      opinion: null,
      showFriendDrawer: null,
      showAuthorDrawer: null
    };
  };

  toggleFriendDrawer = () => {
    this.animateStateChange({
      showAuthorDrawer: false,
      showFriendDrawer: !this.state.showFriendDrawer
    });
  };

  toggleAuthorDrawer = () => {
    this.animateStateChange({
      showFriendDrawer: false,
      showAuthorDrawer: !this.state.showAuthorDrawer
    });
  };

  showBrowseAllOpinions = () => {
    this.animateStateChange(
      Object.assign(
        {
          isBrowse: true,
          visibleFriend: null,
          visibleAuthor: null,
          visibleOpinion: null
        },
        defaultState.hiddenDrawers
      )
    );
  };

  showBrowsedOpinion = opinionId => () => {
    this.fetchSelectedOpinion(opinionId).then(opinion =>
      this.showOpinion(null, opinion.author, opinion)()
    );
  };

  showOpinion = (visibleFriend, visibleAuthor, visibleOpinion) => () => {
    this.setState(
      Object.assign(
        {
          isBrowse: false,
          visibleFriend,
          visibleAuthor,
          visibleOpinion
        },
        defaultState.hiddenDrawers
      )
    );
  };

  animateStateChange = (modifiedState, callback = () => {}) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    this.setState(modifiedState, callback);
  };

  isSelectedFriend(person) {
    return (
      !!this.state.visibleFriend && this.state.visibleFriend.id === person.id
    );
  }

  render() {
    const renderTrusteeGroup = connection => {
      return connection.friends.map((friend, idx) =>
        <NavWrapper key={idx} isSelected={this.isSelectedFriend(friend)}>
          <Person.Button
            person={friend}
            pressAction={this.showOpinion(
              friend,
              connection.author,
              connection.opinion
            )}
          />
        </NavWrapper>
      );
    };

    const renderBook = () =>
      <IconButton
        shape="circle"
        name="book"
        key="book"
        backgroundColor="wheat"
        iconStyle={{ fontSize: 27, height: 27, width: 27, marginRight: 1 }}
        buttonStyle={{ margin: 6 }}
        onPress={this.showBrowseAllOpinions}
      />;

    const Header = ({ friend, author, opinion, userInfluence }) => {
      const drawerState =
        (this.state.showFriendDrawer && 'friend') ||
        (this.state.showAuthorDrawer && 'author') ||
        'closed';

      return (
        <Connection
          state={drawerState}
          friend={friend}
          author={
            author && Object.assign({ influence: opinion.influence }, author)
          }
          influence={userInfluence}
          toggleFriend={this.toggleFriendDrawer}
          toggleAuthor={this.toggleAuthorDrawer}
          choose={this.fetchSetTarget(this.state.topicId, this.state.userId)}
          clear={this.fetchClearTarget(this.state.topicId, this.state.userId)}
        />
      );
    };

    const renderTopicInfo = (influence, connections) => {
      if (!connections.length) {
        return null;
      }

      let delegate = null;

      const found = findInfluencerConnectionCombo(connections);
      if (found) {
        const {
          friend: activeInfluencer,
          connection: activeConnection
        } = found;

        delegate = (
          <Person.Button
            person={Object.assign({ color: 'pink' }, activeInfluencer)}
            size="medium"
            pressAction={this.showOpinion(
              activeInfluencer,
              activeConnection && activeConnection.author,
              activeConnection && activeConnection.opinion
            )}
          />
        );
      }

      return <TopicInfo influence={influence} delegate={delegate} />;
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
          ]}
        >
          <View style={style} />
          <View
            style={{
              position: 'absolute',
              left: '49%',
              width: '2%',
              height: 28,
              backgroundColor: '#ccc'
            }}
          />
        </View>
      );
    };

    const renderAnswers = (answer, prompt) => {
      const { selected, value } = answer;

      return Metric.isScalar(prompt)
        ? renderScalarAnswer(value)
        : <View style={[styles.multipleChoiceAnswer, answerTile]}>
            <Text>
              {prompt.options[selected].text}
            </Text>
          </View>;
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

    const renderDisabledChevron = leftRight =>
      <IconButton
        size={Sizes.SMALL}
        shape="circle"
        name={'chevron-' + leftRight}
        key={leftRight}
        iconStyle={smallIcon}
        color="#ccc"
        backgroundColor="#efefef"
        onPress={() => {}}
      />;

    const renderEnabledChevron = (leftRight, updateFn) =>
      <IconButton
        size={Sizes.SMALL}
        shape="circle"
        name={'chevron-' + leftRight}
        key={leftRight}
        iconStyle={smallIcon}
        color="#444"
        backgroundColor="#ddd"
        onPress={updateFn}
      />;

    const renderPrompt = (prompts, promptIdx, updateFn) => {
      const prompt = prompts[promptIdx];
      const isFirst = promptIdx === 0;
      const isLast = promptIdx === prompts.length - 1;

      return (
        // prompts row
        <View
          key="prompt"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 40,
            marginLeft: 40,
            marginVertical: 16,
            minHeight: 80,
            flex: 1
          }}
        >
          {renderChevron(isFirst, 'left', () => updateFn(promptIdx - 1))}
          <Text
            style={{
              flex: 1,
              fontSize: 18,
              textAlign: 'center',
              paddingHorizontal: 8
            }}
          >
            {prompt.text}
          </Text>
          {renderChevron(isLast, 'right', () => updateFn(promptIdx + 1))}
        </View>
      );
    };

    const renderBrowseOpinions = (
      opinions,
      prompts,
      promptIdx,
      updatePromptFn
    ) => {
      return (
        <ScrollView>
          <View style={{ paddingVertical: 12 }}>
            {renderPrompt(prompts, promptIdx, updatePromptFn)}
            {opinions.map(opinion =>
              <View
                key={opinion.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingHorizontal: 8,
                  paddingVertical: 8
                }}
              >
                <Person.Button
                  person={opinion.author}
                  pressAction={this.showBrowsedOpinion(opinion.id)}
                  influence={opinion.influence}
                />
                <View style={[styles.answers, { paddingRight: 48 }]}>
                  {renderAnswers(
                    opinion.answers[promptIdx],
                    prompts[promptIdx]
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      );
    };

    const renderOpinionText = opinionText =>
      <ScrollView>
        <View style={styles.bodyOfText}>
          <Markdown>
            {opinionText}
          </Markdown>
        </View>
      </ScrollView>;

    const renderBody = state => {
      if (state.isBrowse) {
        return state.visibleOpinion
          ? renderOpinionText(state.visibleOpinion.text)
          : renderBrowseOpinions(
              state.opinions,
              state.prompts,
              state.promptIdx,
              this.updatePrompt
            );
      }

      if (this.isTopicInfo()) {
        return renderTopicInfo(state.influence, state.connections);
      }

      if (this.isNoConnectedOpinionToFriend()) {
        const message = `${state.visibleFriend
          .name} is not connected to any opinions`;

        return renderOpinionText(message);
      }

      return renderOpinionText(state.visibleOpinion.text);
    };

    return (
      <View style={styles.container}>
        {/* NAVIGATION */}
        <View style={styles.selectorIconRow}>
          {/* ScrollView needs a height; either inherited or set, and even
               if it's horizontal */}
          <ScrollView horizontal contentContainerStyle={styles.scrollInterior}>
            {this.state.connections.map(renderTrusteeGroup)}
            <NavWrapper isSelected={this.state.isBrowse}>
              {renderBook()}
            </NavWrapper>
          </ScrollView>
        </View>

        {/* BODY */}
        {/* mark as a row, so that it will fill horizontally */}
        <Header
          friend={this.state.visibleFriend}
          author={this.state.visibleAuthor}
          opinion={this.state.visibleOpinion}
          userInfluence={this.state.influence}
        />
        <View style={{ flex: 1 }}>
          {renderBody(this.state)}
        </View>
      </View>
    );
  }
}

Topic.propTypes = {
  navigation: PropTypes.object.isRequired
};

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
    paddingTop: 12,
    height: 84,
    backgroundColor: '#eee'
  },
  scrollInterior: {
    alignItems: 'center',
    paddingHorizontal: 8
  },
  bodyOfText: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5
  },

  // prompts
  answers: {
    flexDirection: 'row',
    flex: 1
  },
  scalarAnswer: {
    // width: 80
  },
  multipleChoiceAnswer: {}
});
