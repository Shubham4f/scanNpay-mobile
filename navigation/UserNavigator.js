import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/user/Profile.js";
import ResetPassword from "../screens/user/ResetPassword.js";
import ResetPin from "../screens/user/ResetPin.js";

export default function UserNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ResetPin" component={ResetPin} />
    </Stack.Navigator>
  );
}
