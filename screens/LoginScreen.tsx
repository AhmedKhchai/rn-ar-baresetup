import {useMutation} from 'react-query';
import {Alert, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import {useAuth} from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  const navigation = useNavigation();

  const loginMutation = useMutation(login, {
    onSuccess: data => {
      console.log('Access token:', data.access_token);
      console.log('Access token stored in SecureStore');
      navigation.reset({
        index: 0,
        routes: [{name: 'Home' as never, params: {screen: 'Products'}}],
      });
    },
    onError: error => {
      Alert.alert('Error', 'Login failed try again');
      console.error(error);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({email, password});
  };

  return (
    <View style={styles.container}>
      <LottieView
        style={styles.icon}
        source={require('./../assets/coffeebrownpink.json')}
        autoPlay
        loop
      />
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
    marginVertical: 10,
    backgroundColor: '#8f95d3',
    color: '#C2ECFF',
    borderRadius: 10,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
    height: 200,
    width: 200,
  },
});
