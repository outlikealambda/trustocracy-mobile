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
import * as Api from './api';
import { Persons } from '../utils.js';
import * as Prompt from './Prompt.js';

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

function influencerCircle (content, key) {
  return (
    <View
      key={key}
      style={{
        width: 76,
        height: 76,
        borderRadius: 40,
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
      initials={Persons.initials(person)} />
  );

  if (person.isInfluencer) {
    trusteeView = influencerCircle(trusteeView, keyPrefix + person.id);
  }

  return trusteeView;
}

function renderPersonWithInfluence (influence, person, color, pressAction, keyPrefix = 'p') {
  const vertical = {
    outer: {
      width: 76
    },
    inner: {
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#ccc',
      marginHorizontal: 8,
      marginTop: -12,
      paddingVertical: 4
    }
  };

  // const horizontal = {
  //   outer: {
  //     height: 76,
  //     flexDirection: 'row'
  //   },
  //   inner: {
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     borderWidth: 2,
  //     borderColor: '#ccc',
  //     marginVertical: 16,
  //     marginLeft: -10,
  //     paddingHorizontal: 8
  //   }
  // };

  return (
    <View
      key={keyPrefix + person.id}
      style={vertical.outer}>
      {renderPerson(person, color, pressAction, keyPrefix)}
      <View
        style={vertical.inner}>
        <Text
          style={{
            fontSize: 16
          }}>
          {influence}
        </Text>
      </View>
    </View>
  );
}

function renderForNav ({dom, isSelected}) {
  const basicStyle = {
    width: 76,
    height: 84
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
  const {influence, author} = opinionInfo;

  return (
    <TouchableHighlight
      onPress={pressAction}>
      <View style={{width: 76}}>
        {
          renderPersonWithInfluence(influence, author, '#ccc')
        }
      </View>
    </TouchableHighlight>
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
    title: navigation.state.params.title
  })

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
      prompts: [],
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
    this.fetchPrompts(topicId);
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
        console.error(error);
      });
  }

  fetchInfluence = (topicId, userId) => {
    return Api.influence(topicId, userId)
      .then(response => response.json())
      .then(r => this.animateStateChange({ influence: r.influence }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchTopicTitle = topicId => {
    return Api.topicTitle(topicId)
      .then(response => response.json())
      .then(topicInfo => topicInfo.text)
      .then(title => this.animateStateChange({ title }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchOpinions = topicId => {
    return Api.opinions(topicId)
      .then(response => response.json())
      .then(opinions => this.animateStateChange({ opinions }))
      .catch(error => {
        console.error(error);
      });
  }

  fetchPrompts = topicId => {
    return Api.prompts(topicId)
      .then(response => response.json())
      .then(prompts => this.setState({prompts}))
      .catch(error => {
        console.error(error);
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
        iconStyle={{fontSize: 27, height: 27, width: 27, marginRight: 1}}
        onPress={this.showBrowseAllOpinions} />
    );

    const renderExpand = () => (
      <IconButton
        shape='circle'
        name='chevron-left'
        key='expand'
        backgroundColor='wheat'
        iconStyle={{fontSize: 28, height: 28, width: 14}}
        onPress={this.showTrusteeIcons} />
    );

    const renderAuthorNavCircle = author => (
      <InitialsButton
        shape='circle'
        backgroundColor='wheat'
        initials={Persons.initials(author)} />
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
              {renderPersonWithInfluence(
                this.state.selectedConnection.influence,
                author,
                author.isRanked || author.isManual ? friendColor : '#ccc',
                this.toggleAuthorDrawer
              )}
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
        Prompt.isScalar(prompt)
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
        isSmall='true'
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
        isSmall='true'
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

    const renderBrowseOpinions = (opinions, promptsMap, promptIdx, updatePromptFn) => {
      const prompts = Object.values(promptsMap);

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
                    {
                      renderOpinionSelector(opinion, this.showBrowseSingleOpinion(opinion.id))
                    }
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

    const renderOpinionText = (selectedConnection, selectedOpinion) => (
      <ScrollView>
        <View style={styles.instructions}>
          <Markdown>
            { selectedConnection
            ? (selectedConnection.opinion
              ? selectedConnection.opinion.text
              : '*...No connected opinion...*'
              )
            : (selectedOpinion
              ? selectedOpinion.text
              : ''
              )
            }
          </Markdown>
        </View>
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        <View
          style={styles.selectorIconRow}>
          { /* ScrollView needs a height; either inherited or set, and even
               if it's horizontal */}
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollInterior}>
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
          {
            this.state.isBrowse && (!this.state.selectedOpinion || !this.state.selectedOpinion.text)
            ? renderBrowseOpinions(this.state.opinions, this.state.prompts, this.state.promptIdx, this.updatePrompt)
            : renderOpinionText(this.state.selectedConnection, this.state.selectedOpinion)
          }
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

  // influence
  influenceSquare: {
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center'
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
