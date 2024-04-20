import { useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { BalanceBox } from "../components/index.js";
import { RecentTransactions } from "../components/transaction/index.js";
import AppContext from "../context/AppContext.js";
import colors from "../global/colors.js";

export default function Home({ navigation }) {
  const { user } = useContext(AppContext);

  const navigateToScanner = () => {
    navigation.navigate("TransferNavigator", { screen: "Scanner" });
  };

  const navigateToContact = () => {
    navigation.navigate("TransferNavigator", { screen: "Contact" });
  };

  const navigateToDepositAmount = () => {
    navigation.navigate("TransferNavigator", { screen: "DepositAmount" });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greetings}>Hi! 👋🏼</Text>
        <Text style={styles.name}>{user.firstName}</Text>
        <BalanceBox />
        <View style={styles.buttonsContianer}>
          <Pressable style={styles.button} onPress={navigateToScanner}>
            <Image
              style={styles.buttonImage}
              source={require("../assets/icons/scan.png")}
            />
            <Text style={styles.buttonText}>Scan QR</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={navigateToContact}>
            <Image
              style={styles.buttonImage}
              source={require("../assets/icons/contact.png")}
            />
            <Text style={styles.buttonText}>Contact</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={navigateToDepositAmount}>
            <Image
              style={styles.buttonImage}
              source={require("../assets/icons/deposit.png")}
            />
            <Text style={styles.buttonText}>Deposit</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Image
              style={styles.buttonImage}
              source={require("../assets/icons/withdraw.png")}
            />
            <Text style={styles.buttonText}>Withdraw</Text>
          </Pressable>
        </View>
        <RecentTransactions />
      </ScrollView>
      <ExpoStatusBar style="dark" backgroundColor="#fff" />
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
  },
  greetings: {
    fontFamily: "RobotoMedium",
    fontSize: 16,
    color: colors.secondary,
  },
  name: {
    fontFamily: "RobotoBold",
    fontSize: 22,
    color: colors.primary,
    marginTop: 4,
  },
  buttonsContianer: {
    flexDirection: "row",
    marginTop: 25,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    flex: 1 / 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    height: 24,
    width: 24,
  },
  buttonText: {
    marginTop: 8,
    fontFamily: "RobotoMedium",
    fontSize: 12,
    color: colors.secondary,
  },
});
