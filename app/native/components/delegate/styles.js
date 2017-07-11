import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16
  },
  headerRow: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 32,
    backgroundColor: '#efefef',
    borderTopWidth: 2,
    borderColor: '#ccc',
    marginBottom: 16
  },
  textInput: {
    paddingHorizontal: 8,
    marginHorizontal: 8,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1,
    marginVertical: 8
  },
  column: {
    flex: 1,
    justifyContent: 'space-between'
  },
  saveResetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    flex: 0
  },
  icon: {
    color: '#efefef'
  },
  buttonStyle: {
    backgroundColor: '#555'
  },
  bigNumber: {
    marginHorizontal: 8,
    color: 'green',
    fontSize: 24,
    fontWeight: 'bold'
  },
  nav: {
    paddingVertical: 4,
    justifyContent: 'space-around'
  }
});
