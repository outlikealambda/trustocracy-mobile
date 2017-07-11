import React from 'react';
import {
  View
} from 'react-native';

import { InitialsButton } from './Buttons.js';
import { Persons } from '../utils.js';
import Influence from './Influence.js';

// Optional influence argument toggles influence badge
export const Button = ({person, pressAction, influence}) => {
  const {id, color, isInfluencer = false, isRanked = false} = person;
  const key = id;

  const buttonStyle = isInfluencer
    ? {
      margin: 2
    }
    : {
      margin: 6
    };

  let button =
    <InitialsButton
      shape={isRanked ? 'circle' : 'square'}
      onPress={pressAction}
      key={key}
      backgroundColor={color}
      buttonStyle={buttonStyle}
      initials={Persons.initials(person)} />;

  if (isInfluencer) {
    button = markAsInfluencer(button, key);
  }

  if (influence || influence === 0) {
    button = addInfluenceBadge(button, influence, key);
  }

  return button;
};

function markAsInfluencer (content, key) {
  return (
    <View
      key={key}
      style={{
        borderWidth: 4,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'turquoise'
      }}>
      {content}
    </View>
  );
}

function addInfluenceBadge (personButton, influence, key) {
  const horizontal = {
    outer: {
      flexDirection: 'row'
    }
  };

  return (
    <View
      key={key}
      style={horizontal.outer}>
      {personButton}
      <Influence
        influence={influence}
        style={{marginLeft: -10}}
        />
    </View>
  );
}
