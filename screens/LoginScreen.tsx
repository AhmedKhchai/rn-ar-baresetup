import {useMutation} from 'react-query';
import axios from 'axios';
import {Alert, Button, StyleSheet, View, TextInput} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

type LoginParams = {
  email: string;
  password: string;
};

const login = async ({email, password}: LoginParams) => {
  const response = await axios.post('http://mspr.scholatech.com/api/login', {
    email,
    password,
  });

  if (response.status !== 200) {
    throw new Error('Login failed');
  }

  return response.data;
};
const options = {
  sharedPreferencesName: 'mySharedPrefs',
  keychainService: 'myKeychain',
};
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation();

  const loginMutation = useMutation(login, {
    onSuccess: data => {
      console.log('Access token:', data.access_token);
      SInfo.setItem('userToken', data.access_token, options).then(() =>
        setIsAuthenticated(true),
      );
      console.log('Access token stored in SecureStore');
      navigation.navigate('Products' as never);
    },
    onError: error => {
      Alert.alert('Error', 'Login failed try again');
      console.error(error);
    },
  });

  const handleLogout = () => {
    SInfo.deleteItem('userToken', options).then(() =>
      setIsAuthenticated(false),
    );
  };

  const handleLogin = () => {
    loginMutation.mutate({email, password});
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
