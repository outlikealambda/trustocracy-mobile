import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import * as Person from '../Person.js';
import { TextButton, Shapes, Sizes } from '../Buttons.js';

import { Octicons } from '@expo/vector-icons';

import { Arrays } from '../../utils.js';

type BoldProps = {
  children: string
};

const BoldText = ({ children }: BoldProps): Element<Text> => {
  return (
    <Text style={{ fontWeight: 'bold' }}>
      {children}
    </Text>
  );
};

const Chosen = ({ name, influence, clear }) =>
  <View style={styles.drawer}>
    <Text
      style={[
        styles.drawerRow,
        { backgroundColor: 'lightgreen', paddingVertical: 16 }
      ]}
    >
      <BoldText>{name}</BoldText> is your delegate!{'\n'}
      You have passed on <BoldText>+{influence} pts</BoldText> of influence
    </Text>
    <View
      style={[
        styles.drawerRow,
        styles.drawerTop,
        styles.drawerRowWrapper,
        { marginLeft: 0 }
      ]}
    >
      <TextButton
        text="Remove"
        shape={Shapes.CIRCLE}
        size={Sizes.SMALL}
        onPress={clear}
        buttonStyle={{ backgroundColor: '#aaa', marginRight: 6 }}
      />
      <Text style={{ flex: 1 }}>
        <BoldText>{name}</BoldText> as my delegate
      </Text>
    </View>
    <Text
      style={[
        styles.drawerRow,
        styles.drawerBottom,
        { fontSize: 12, fontStyle: 'italic' }
      ]}
    >
      {`This will redirect your influence to your top-ranked friend`}
    </Text>
  </View>;

Chosen.propTypes = {
  name: PropTypes.string.isRequired,
  influence: PropTypes.number.isRequired,
  clear: PropTypes.func.isRequired
};

const DefaultIsActive = ({ name, influence }) =>
  <View style={styles.drawer}>
    <Text
      style={[styles.drawerRow, { backgroundColor: 'lightgreen', padding: 16 }]}
    >
      <BoldText>{name}</BoldText> is your default delegate!{'\n'}
      You have passed on <BoldText>+{influence} pts</BoldText> of influence
    </Text>
  </View>;

DefaultIsActive.propTypes = {
  name: PropTypes.string.isRequired,
  influence: PropTypes.number.isRequired
};

const ChooseFriend = ({ name, influence, choose }) =>
  <View style={styles.drawer}>
    <View
      style={[
        styles.drawerRow,
        styles.drawerTop,
        styles.drawerBottom,
        styles.drawerRowWrapper
      ]}
    >
      <TextButton
        shape={Shapes.CIRCLE}
        size={Sizes.SMALL}
        text={'Delegate'}
        onPress={choose}
        buttonStyle={{ backgroundColor: 'lightgreen', marginRight: 4 }}
      />
      <Text style={{ flex: 1 }}>
        <BoldText>+{influence} pts</BoldText> of influence to {name}
      </Text>
    </View>
  </View>;

ChooseFriend.propTypes = {
  name: PropTypes.string.isRequired,
  influence: PropTypes.number.isRequired,
  choose: PropTypes.func.isRequired
};

const ChooseAuthor = ({ name, choose }) =>
  <View style={styles.drawer}>
    <View style={[styles.drawerRow, styles.drawerRowWrapper, styles.drawerTop]}>
      <TextButton
        shape={Shapes.CIRCLE}
        size={Sizes.SMALL}
        text={'Delegate Directly'}
        onPress={choose}
        buttonStyle={{ backgroundColor: 'lightgreen', marginRight: 4 }}
      />
      <Text style={{ flex: 1 }}>
        to {name}
      </Text>
    </View>
    <Text
      style={[
        styles.drawerRow,
        styles.drawerBottom,
        { fontSize: 12, fontStyle: 'italic' }
      ]}
    >
      {`Can you personally vouch for ${name}, or are you an expert` +
        ` in this topic and able to confirm the claims in this article? If` +
        ` not, consider delegating to a friend who knows more about this` +
        ` topic`}
    </Text>
  </View>;

ChooseAuthor.propTypes = {
  name: PropTypes.string.isRequired,
  choose: PropTypes.func.isRequired
};

const Drawer = ({ person, influence, choose, clear }) => {
  const chooseThisPerson = choose(person.id);

  if (person.isManual) {
    return <Chosen name={person.name} influence={influence} clear={clear} />;
  }

  // Person is the default influencer on this topic
  if (person.isInfluencer) {
    return <DefaultIsActive name={person.name} influence={influence} />;
  }

  // Person is a friend, and not selected on this topic
  if (person.isRanked) {
    return (
      <ChooseFriend
        name={person.name}
        influence={influence}
        choose={chooseThisPerson}
      />
    );
  }

  // Person is a non-friend author
  return <ChooseAuthor name={person.name} choose={chooseThisPerson} />;
};

Drawer.propTypes = {
  person: PropTypes.object.isRequired,
  influence: PropTypes.number.isRequired,
  choose: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired
};

export class Connection extends Component {
  render() {
    const {
      state: drawerState,
      friend,
      influence,
      toggleFriend,
      toggleAuthor,
      choose,
      clear
    } = this.props;

    // If author is same as friend, set to null so as not to display twice
    const author =
      friend && this.props.author && friend.id === this.props.author.id
        ? null
        : this.props.author;

    return (
      <View style={{ flex: 0 }}>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 8
            }}
          >
            {friend &&
              <Person.Initials person={friend} pressAction={toggleFriend} />}
            {friend &&
              author &&
              Arrays.range(8, idx =>
                <View key={idx} style={[styles.miniCircle]} />
              )}
            {friend &&
              author &&
              <Octicons name="chevron-right" size={20} color="#999" />}
            {author &&
              <Person.Initials
                person={author}
                pressAction={toggleAuthor}
                influence={author.influence}
              />}
          </View>
        </View>
        {isOpen(drawerState) &&
          <Drawer
            person={getDrawerPerson(drawerState, friend, author)}
            influence={influence}
            clear={clear}
            choose={choose}
          />}
      </View>
    );
  }
}

Connection.propTypes = {
  state: PropTypes.string,
  friend: PropTypes.object,
  author: PropTypes.object,
  toggleFriend: PropTypes.func.isRequired,
  toggleAuthor: PropTypes.func.isRequired,
  influence: PropTypes.number.isRequired,
  choose: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired
};

const getDrawerPerson = (drawerState, friend, author) => {
  switch (drawerState) {
    case 'friend':
      return friend;
    case 'author':
      return author;
    default:
      return null;
  }
};

const isOpen = drawerState =>
  drawerState === 'friend' || drawerState === 'author';

const styles = StyleSheet.create({
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
  }
});
