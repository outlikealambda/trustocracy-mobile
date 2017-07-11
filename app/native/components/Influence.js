
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function Influence ({influence, style = {}, fontSize = 16}) {
  return (
    <View style={[styles.influence, style]}>
      <Text style={{fontSize}}>
        {influence}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  influence: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 16,
    paddingHorizontal: 8
  }
});
