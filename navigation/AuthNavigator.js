import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../screens/auth/Onboarding.js";
import SignUp from "../screens/auth/SignUp.js";
import SignIn from "../screens/auth/SignIn.js";
import ResetPassword from "../screens/auth/ResetPassword.js";

export default function AuthNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="RestPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
