import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16
  },
  headerRow: {
    alignItems: 'center',
    marginVertical: 16
  },
  inputRow: {
  },
  textInput: {
    paddingHorizontal: 8,
    marginHorizontal: 4,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1
  },
  initialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
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
  }
});
