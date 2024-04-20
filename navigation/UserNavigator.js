import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/user/Profile.js";

export default function UserNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
