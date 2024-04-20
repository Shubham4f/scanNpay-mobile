import { View, Text, StyleSheet } from "react-native";
import { PrimaryButton } from "../buttons/index.js";
import colors from "../../global/colors.js";

export default function AlertBox({ title, message, visible, setVisible }) {
  if (visible) {
    return (
      <View style={style.container}>
        <View style={style.popup}>
          <Text style={style.title}>{title}</Text>
          <Text style={style.message}>{message}</Text>
          <View style={style.buttonContianer}>
            <PrimaryButton onPress={() => setVisible(false)}>Ok</PrimaryButton>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  popup: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    maxWidth: 280,
  },
  title: {
    marginBottom: 15,
    fontFamily: "RobotoBold",
    fontSize: 20,
    textAlign: "center",
    color: colors.secondary,
  },
  message: {
    marginBottom: 30,
    fontFamily: "RobotoRegular",
    fontSize: 14,
    textAlign: "center",
    color: colors.textLight,
  },
  buttonContianer: { width: 250, height: 56 },
});
