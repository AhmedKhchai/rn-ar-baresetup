import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../hooks/useAuth';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {logout} = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{name: 'Login' as never}],
    });
  };

  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={handleLogout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#253d5b',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#8f95d3',
    color: '#C2ECFF',
    borderRadius: 10,
  },
});
