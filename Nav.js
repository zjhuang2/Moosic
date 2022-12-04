// import HomeScreen from './screens/HomeScreen';
// import DetailsScreen from './screens/DetailsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import MoodScreen from './screens/MoodScreen';

import Ionicons from 'react-native-vector-icons/Ionicons'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './data/Reducer';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: rootReducer, 
});

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions = {({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Home') {
            iconName = focused ? 'home' : 'home-outline' // change tthe icoons
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          } else if (rn === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline'
          }

          return <Ionicons name = {iconName} size = {size} color = {color}/>
        },
      })}
    >
      <Tab.Screen options={{headerShown: false}} name={'Home'} component = {HomeScreen}/>
      <Tab.Screen options={{headerShown: false}} name={'Profile'} component = {ProfileScreen}/>
      <Tab.Screen options={{headerShown: false}} name={'Settings'} component = {SettingsScreen}/>
    </Tab.Navigator>
  )
}


function Nav() {
    
  
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                  <Stack.Screen name = "Login" component = {LoginScreen}/>
                    <Stack.Screen name="Start" component={MainTabNavigator} />
                    <Stack.Screen name = "Mood" component = {MoodScreen} />
                    {/* Add more screens here if necessary */}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>


      );
  }
  
  export default Nav;