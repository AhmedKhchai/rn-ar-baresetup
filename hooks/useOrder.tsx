import {useQuery} from 'react-query';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

const fetchOrders = async () => {
  const options = {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain',
  };

  const userToken = await SInfo.getItem('userToken', options);
  const user = await SInfo.getItem('user', options);
  if (user?.role === 'admin') {
    const {data} = await axios.get('http://scholatech.com/api/orders/', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return data;
  } else {
    const {data} = await axios.get('http://scholatech.com/api/user/orders/', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return data;
  }
};

export const useOrder = () => {
  return useQuery('orders', fetchOrders);
};
