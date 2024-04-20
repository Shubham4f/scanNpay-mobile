import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import colors from "../../global/colors.js";

export default function LoadingOverlay({ loading }) {
  if (loading) {
    return (
      <View style={style.container}>
        <ActivityIndicator
          color={colors.secondary}
          size={Platform.OS === "ios" ? "large" : 80}
        />
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
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
  },
});
