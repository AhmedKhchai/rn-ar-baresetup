import {useMutation} from 'react-query';
import axios from 'axios';
import {Alert, StyleSheet, View} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput, Button} from 'react-native-paper';
import CoffeeIcon from '../assets/CoffeeIcon';

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
      <CoffeeIcon style={styles.icon} />
      {isAuthenticated ? (
        <Button style={styles.button} onPress={handleLogout}>
          Logout
        </Button>
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
            label="Password"
            secureTextEntry
            right={<TextInput.Icon icon="eye" />}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Button style={styles.button} onPress={handleLogin}>
            Login
          </Button>
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
    backgroundColor: '#253d5b',
  },
  input: {
    height: 60,
    borderColor: 'gray',
    backgroundColor: '#C2ECFF',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
    top: 10,
    backgroundColor: '#8f95d3',
    color: '#C2ECFF',
    borderRadius: 10,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
    height: 150,
    width: 150,
  },
});
