import { useContext } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { TextButton } from "../components/buttons/index.js";
import AppContext from "../context/AppContext.js";
import colors from "../global/colors.js";

export default function Settings() {
  const { signOutSave, user } = useContext(AppContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text>Settings</Text>
        <TextButton onPress={signOutSave}>Sign Out</TextButton>
        <Text>Developed By Shubham4f</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight + 8,
      },
      ios: {
        paddingTop: 8,
      },
    }),
  },
  innerContainer: {
    paddingHorizontal: 24,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
