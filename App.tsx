import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {QueryClientProvider, QueryClient} from 'react-query';
import LoginScreen from './screens/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProductsScreen from './screens/ProductsScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import LottieView from 'lottie-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  name: string;
  color: string;
  size: number;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({name, color, size}) => {
  let lottieJson;

  if (name === 'Products') {
    lottieJson = require('./assets/home-lottie.json');
  } else if (name === 'Orders') {
    lottieJson = require('./assets/orders-lottie.json');
  } else if (name === 'Profile') {
    lottieJson = require('./assets/profile-lottie.json');
  }

  return (
    <LottieView
      source={lottieJson as any}
      autoPlay
      loop
      style={{width: size, height: size}}
    />
  );
};

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => (
          <TabBarIcon name={route.name} color={color} size={size} />
        ),
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={AuthenticatedStack}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
