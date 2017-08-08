/*
 * @flow
 */
import React from 'react';
import { View } from 'react-native';

import { InitialsButton, type SizeType } from './Buttons.js';
import Influence from './Influence.js';

// Optional influence argument toggles influence badge
type InitialsType = {
  person: Object,
  pressAction: Function,
  influence?: number,
  size?: SizeType
};

export function Initials({
  person,
  pressAction,
  influence,
  size
}: InitialsType) {
  const {
    id: key,
    color,
    isInfluencer = false,
    isConnected = false,
    isRanked = false
  } = person;

  const isRelated = person.relationships && person.relationships.length > 0;
  const backgroundColor = isRelated ? color : '#ddd';
  const opacity = isConnected ? 1 : 0.4;

  const buttonStyle = isInfluencer
    ? {
        margin: 2,
        opacity
      }
    : {
        margin: 6,
        opacity
      };

  let button = (
    <InitialsButton
      shape={isRanked ? 'circle' : 'square'}
      onPress={pressAction}
      key={key}
      size={size}
      backgroundColor={backgroundColor}
      buttonStyle={buttonStyle}
      initials={initials(person)}
    />
  );

  if (isInfluencer) {
    button = markAsInfluencer(button, key);
  }

  if (influence || influence === 0) {
    button = addInfluenceBadge(button, influence, key);
  }

  return button;
}

function markAsInfluencer(content, key) {
  return (
    <View
      key={key}
      style={{
        borderWidth: 4,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'turquoise'
      }}
    >
      {content}
    </View>
  );
}

function addInfluenceBadge(personButton, influence, key) {
  const horizontal = {
    outer: {
      flexDirection: 'row'
    }
  };

  return (
    <View key={key} style={horizontal.outer}>
      {personButton}
      <Influence influence={influence} style={{ marginLeft: -10 }} />
    </View>
  );
}
// super fragile...
function initials(friend) {
  if (friend) {
    const { name } = friend;
    return name[0] + name.split(' ')[1][0];
  }
  return '';
}
