import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default function Influence({ influence, style = {}, fontSize = 16 }) {
  return (
    <View style={[styles.influence, style]}>
      <Text style={{ fontSize }}>
        {influence}
      </Text>
    </View>
  );
}

Influence.propTypes = {
  influence: PropTypes.number.isRequired,
  // style: PropTypes.obje
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  fontSize: PropTypes.number
};

const styles = StyleSheet.create({
  influence: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 16,
    paddingVertical: 4,
    paddingHorizontal: 8
  }
});
