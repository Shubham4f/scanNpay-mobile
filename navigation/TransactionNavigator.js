import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TransactionHistory from "../screens/transaction/TransactionHistory.js";
import TransactionDetails from "../screens/transaction/TransactionDetails.js";

export default function TransactionNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="TransactionHistory"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
    </Stack.Navigator>
  );
}
