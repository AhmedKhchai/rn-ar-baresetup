import {useQuery} from 'react-query';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

const fetchProducts = async () => {
  const options = {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain',
  };

  const userToken = await SInfo.getItem('userToken', options);
  const {data} = await axios.get('http://mspr.scholatech.com/api/products/', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  return data;
};

export const useProduct = () => {
  return useQuery('products', fetchProducts);
};
