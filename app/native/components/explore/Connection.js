import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as Person from '../Person.js';
import { RoundedButton } from '../Buttons.js';

import { Octicons } from '@expo/vector-icons';

const BoldText = props => {
  return (<Text style={{fontWeight: 'bold'}}>{props.children}</Text>);
};

const Chosen = ({name, influence, clear}) => (
  <View style={styles.drawer}>
    <Text style={[styles.drawerRow, {backgroundColor: 'lightgreen', paddingVertical: 16}]}>
      <BoldText>{name}</BoldText> is your delegate!{'\n'}
      You have passed on <BoldText>+{influence}pts</BoldText> of influence
    </Text>
    <View style={[styles.drawerRow, styles.drawerTop, styles.drawerRowWrapper, {marginLeft: 0}]}>
      <RoundedButton
        text='Remove'
        size='small'
        onPress={clear}
        buttonStyle={{backgroundColor: '#aaa', marginRight: 6}}
        />
      <Text style={{flex: 1}}>
        <BoldText>{name}</BoldText> as my delegate
      </Text>
    </View>
    <Text style={[styles.drawerRow, styles.drawerBottom, {fontSize: 12, fontStyle: 'italic'}]}>
      {`This will redirect your influence to your top-ranked friend`}
    </Text>
  </View>
);

const DefaultIsActive = ({name, influence}) => (
  <View style={styles.drawer}>
    <Text style={[styles.drawerRow, {backgroundColor: 'lightgreen', padding: 16}]} >
      <BoldText>{name}</BoldText> is your default delegate!{'\n'}
      You have passed on <BoldText>+{influence}pts</BoldText> of influence
    </Text>
  </View>
);

const ChooseFriend = ({name, influence, choose}) => (
  <View style={styles.drawer}>
    <View style={[styles.drawerRow, styles.drawerTop, styles.drawerBottom, styles.drawerRowWrapper]}>
      <RoundedButton
        text={'Delegate'}
        onPress={choose}
        buttonStyle={{backgroundColor: 'lightgreen', marginRight: 4}}
        />
      <Text style={{flex: 1}}>
        <BoldText>+{influence}pts</BoldText> of influence to {name}
      </Text>
    </View>
  </View>
);

const ChooseAuthor = ({name, influence, choose}) => (
  <View style={styles.drawer}>
    <View style={[styles.drawerRow, styles.drawerRowWrapper, styles.drawerTop]}>
      <RoundedButton
        text={'Delegate Directly'}
        onPress={choose}
        buttonStyle={{backgroundColor: 'lightgreen', marginRight: 4}}
      />
      <Text style={{flex: 1}}>to {name}</Text>
    </View>
    <Text style={[styles.drawerRow, styles.drawerBottom, {fontSize: 12, fontStyle: 'italic'}]}>
      {
        `Can you personally vouch for ${name}, or are you an expert` +
        ` in this topic and able to confirm the claims in this article? If` +
        ` not, consider delegating to a friend who knows more about this` +
        ` topic`
      }
    </Text>
  </View>

);

const Drawer = ({person, influence, choose, clear}) => {
  const chooseThisPerson = choose(person.id);

  if (person.isManual) {
    return (
      <Chosen
        name={person.name}
        influence={influence}
        clear={clear} />
    );
  }

  // Person is the default influencer on this topic
  if (person.isInfluencer) {
    return (
      <DefaultIsActive
        name={person.name}
        influence={influence} />
    );
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
  return (
    <ChooseAuthor
      name={person.name}
      influence={influence}
      choose={chooseThisPerson}
      />
  );
};

export class Connection extends Component {
  render () {
    const {state, friend, author, influence, toggleFriend, toggleAuthor, choose, clear} = this.props;

    console.log('friend', friend, 'author', author);

    return (
      <View style={{flex: 0}}>
        <View style={{flex: 0, flexDirection: 'row'}}>
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
                pressAction={toggleFriend}
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
                pressAction={toggleAuthor}
                influence={author.influence}
                />
            }
          </View>
        </View>
        { isOpen(state) &&
          <Drawer
            person={getDrawerPerson(state, friend, author)}
            influence={influence}
            clear={clear}
            choose={choose}
            />
        }
      </View>
    );
  }
}

const getDrawerPerson = (state, friend, author) => {
  switch (state) {
    case 'friend':
      return friend;
    case 'author':
      return author;
    default:
      return null;
  }
};

const isOpen = state => state === 'friend' || state === 'author';

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
