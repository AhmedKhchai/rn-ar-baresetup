import {useState, useEffect} from 'react';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

type LoginParams = {
  email: string;
  password: string;
};

const options = {
  sharedPreferencesName: 'mySharedPrefs',
  keychainService: 'myKeychain',
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    SInfo.getItem('userToken', options).then(userToken => {
      if (userToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const login = async ({email, password}: LoginParams) => {
    const response = await axios.post('http://scholatech.com/api/login', {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error('Login failed');
    }

    await SInfo.setItem('userToken', response.data.access_token, options);
    await SInfo.setItem('user', JSON.stringify(response.data.user), options);
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = async () => {
    await SInfo.deleteItem('userToken', options);
    setIsAuthenticated(false);
  };

  return {isAuthenticated, login, logout};
}
