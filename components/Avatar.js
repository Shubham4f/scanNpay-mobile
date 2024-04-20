import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppContext from "../context/AppContext.js";
import colors from "../global/colors.js";

export default function Avatar({ display, phoneNumber, size }) {
  const { user } = useContext(AppContext);
  return (
    <View
      style={[
        styles.avatar,
        size && { height: size, width: size },
        user.phoneNumber === phoneNumber
          ? { backgroundColor: colors.primary }
          : {
              backgroundColor: generateColour(
                phoneNumber,
                user.firstName,
                user.lastName
              ),
            },
      ]}
    >
      <Text style={styles.avatarText}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.lightBackground,
  },
  avatarText: {
    color: colors.white,
    fontFamily: "RobotoMedium",
    fontSize: 14,
  },
});

function generateColour(phoneNumber, firstName, lastName) {
  const colorsList = [
    "#990000", // Red
    "#CC6600", // Orange
    "#999900", // Yellow
    "#006600", // Lime
    "#006666", // Cyan
    "#000099", // Blue
    "#660066", // Purple
    "#CC3299", // Deep Pink
    "#CC9900", // Gold
    "#CC4D00", // Orange Red
    "#594158", // Dark Violet
    "#005C99", // Deep Sky Blue
    "#663366", // Dark Orchid
    "#CC6633", // Tomato
    "#336666", // Medium Turquoise
    "#CC6666", // Salmon
    "#4D3B31", // Blue Violet
  ];

  let sum = 0;
  for (let i = phoneNumber.length - 1; i > 7; i--) {
    sum += +phoneNumber[i];
  }
  sum +=
    firstName.length +
    lastName.length +
    phoneNumber[0] +
    phoneNumber[4] +
    phoneNumber[9];

  return colorsList[sum % colorsList.length];
}
