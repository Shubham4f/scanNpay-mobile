import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../../global/colors.js";

export default function PrimaryButton({ children, onPress, loading }) {
  return (
    <Pressable
      onPress={loading ? () => null : onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed && !loading ? styles.pressed : "",
      ]}
    >
      {loading ? (
        <ActivityIndicator size={32} color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    height: 56,
    maxHeight: 56,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "RobotoBold",
    fontSize: 16,
    color: colors.white,
  },
  pressed: {
    opacity: 0.9,
  },
});
