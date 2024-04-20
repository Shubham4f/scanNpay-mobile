import { Pressable, Text } from "react-native";
import colors from "../../global/colors.js";

export default function TextButton({
  children,
  onPress,
  fontFamily,
  fontSize,
  color,
}) {
  return (
    <Pressable
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      onPress={onPress}
      style={({ pressed }) =>
        pressed
          ? {
              opacity: 0.9,
            }
          : ""
      }
    >
      <Text
        style={{
          fontFamily: fontFamily || "RobotoBold",
          fontSize: fontSize || 16,
          color: color || colors.primary,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
