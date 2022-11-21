import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";

// import { rootReducer } from "./data/Reducer";

import FeedScreen from "./screens/FeedScreen";

// const store = configureStore({
//   reducer: rootReducer,
// });

function Nav() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Feed"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Feed" component={FeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Nav;
