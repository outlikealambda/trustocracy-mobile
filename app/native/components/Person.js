/*
 * @flow
 */
import React from 'react';
import { View } from 'react-native';

import { InitialsButton, TextButton, type SizeType } from './Buttons.js';
import Influence from './Influence.js';

type NameStyleType = 'initials' | 'full';

const NameStyle = {
  INITIALS: 'initials',
  FULL: 'full'
};

type ButtonProps = {
  person: Object,
  pressAction: Function,
  influence?: number,
  size: SizeType
};

export function Full(props: ButtonProps) {
  return <ButtonWrapper {...props} nameStyle={NameStyle.FULL} />;
}

export function Initials(props: ButtonProps) {
  return <ButtonWrapper {...props} nameStyle={NameStyle.INITIALS} />;
}

type ButtonWrapperProps = ButtonProps & { nameStyle: NameStyleType };

function ButtonWrapper({
  person,
  pressAction,
  influence,
  size,
  nameStyle
}: ButtonWrapperProps) {
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
        opacity,
        backgroundColor
      }
    : {
        margin: 6,
        opacity,
        backgroundColor
      };

  let button =
    nameStyle == NameStyle.INITIALS
      ? <InitialsButton
          shape={isRanked ? 'circle' : 'square'}
          onPress={pressAction}
          key={key}
          size={size}
          buttonStyle={buttonStyle}
          initials={initials(person)}
        />
      : <TextButton
          shape={isRanked ? 'circle' : 'square'}
          onPress={pressAction}
          key={key}
          size={size}
          buttonStyle={buttonStyle}
          text={person.name}
        />;

  if (isInfluencer) {
    button = markAsInfluencer(button, key);
  }

  if (influence || influence === 0) {
    button = addInfluenceBadge(button, influence, key);
  }

  return button;
}
// Optional influence argument toggles influence badge
type InitialsType = {
  person: Object,
  pressAction: Function,
  influence?: number,
  size?: SizeType
};

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
