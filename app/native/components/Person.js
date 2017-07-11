import React from 'react';
import {
  View
} from 'react-native';

import { InitialsButton } from './Buttons.js';
import { Persons } from '../utils.js';

export const Button = ({person, pressAction, keyPrefix = 'p'}) => {
  const {id, color, isInfluencer = false, isRanked = false} = person;
  const key = keyPrefix + id;

  const buttonStyle = isInfluencer
    ? {
      margin: 2
    }
    : {
      margin: 6
    };

  const transform = !isInfluencer ? p => p : p => markInfluencer(p, key);

  return transform(
    <InitialsButton
      shape={isRanked ? 'circle' : 'square'}
      onPress={pressAction}
      key={key}
      backgroundColor={color}
      buttonStyle={buttonStyle}
      initials={Persons.initials(person)} />
  );
};

function markInfluencer (content, key) {
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
