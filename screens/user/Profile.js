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
import { TextButton } from "../../components/buttons/index.js";
import AppContext from "../../context/AppContext.js";
import colors from "../../global/colors.js";

export default function Profile() {
  const { signOutSave, user } = useContext(AppContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <QRCode
          value={user.phoneNumber}
          size={150}
          logo={require("../../assets/icons/icon-crop.png")}
        />
        <TextButton onPress={signOutSave}>Sign Out</TextButton>
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
