import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Scanner from "../screens/transfer/Scanner.js";
import Contact from "../screens/transfer/Contact.js";
import TransferAmount from "../screens/transfer/TransferAmount.js";
import TransferPin from "../screens/transfer/TransferPin.js";
import DepositAmount from "../screens/transfer/DepositAmount.js";

export default function TransferNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Scanner"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="TransferAmount" component={TransferAmount} />
      <Stack.Screen name="TransferPin" component={TransferPin} />
      <Stack.Screen name="DepositAmount" component={DepositAmount} />
    </Stack.Navigator>
  );
}
