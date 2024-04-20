import { Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../global/colors.js";

export default function SqaureBackButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContainer,
        pressed ? styles.pressed : "",
      ]}
    >
      <Feather name="chevron-left" size={24} color={colors.balck} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    borderColor: colors.stroke,
    borderWidth: 1,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.9,
  },
});
