import { View, Text, StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import colors from "../../global/colors.js";

export default function NoInternetOverlay() {
  const netInfo = useNetInfo();
  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
    return (
      <View style={style.container}>
        <Feather name="wifi-off" size={16} color={colors.white} />
        <Text style={style.message}>No internet connection</Text>
      </View>
    );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    top: Constants.statusBarHeight,
    right: 0,
    left: 0,
  },
  message: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    textAlign: "center",
    marginLeft: 10,
    color: colors.white,
  },
});
