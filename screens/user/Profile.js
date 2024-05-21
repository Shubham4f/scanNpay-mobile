import { useContext } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { PrimaryButton } from "../../components/buttons/index.js";
import AppContext from "../../context/AppContext.js";
import colors from "../../global/colors.js";

export default function Profile({ navigation }) {
  const { user } = useContext(AppContext);

  const navigateToResetPassword = () => {
    navigation.navigate("ResetPassword");
  };

  const navigateToResetPin = () => {
    navigation.navigate("ResetPin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.detailsContainer}>
          <QRCode
            value={user.phoneNumber}
            size={200}
            logo={require("../../assets/icons/icon-crop.png")}
          />
          <Text style={styles.nameText}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.numberText}>{user.phoneNumber}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={navigateToResetPassword}>
            Change Password
          </PrimaryButton>
          <PrimaryButton onPress={navigateToResetPin}>Change PIN</PrimaryButton>
        </View>
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
  },
  headerText: {
    color: colors.secondary,
    fontSize: 24,
    fontFamily: "RobotoBold",
  },
  detailsContainer: {
    marginVertical: 24,
    width: "100%",
    alignItems: "center",
  },
  nameText: {
    fontFamily: "RobotoBold",
    fontSize: 22,
    color: colors.primary,
    marginTop: 4,
  },
  numberText: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    color: colors.secondary,
  },
  buttonContainer: {
    width: "100%",
    height: 120,
    marginTop: "auto",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
