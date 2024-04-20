import { useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar.js";
import { TextButton } from "./buttons/index.js";
import { detailsAPI } from "../apis/securedAPIs.js";
import AppContext from "../context/AppContext.js";
import colors from "../global/colors.js";

export default function ContactListItem({ contact }) {
  const number =
    contact.phoneNumber ||
    contact?.phoneNumbers[0]?.number.replace(/[\s-]+/g, "").slice(-10);
  const name = contact.name || `${contact.firstName} ${contact.lastName}`;

  const [errorText, SetErrorText] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AppContext);

  const getDetails = async () => {
    if (user.phoneNumber === number) return SetErrorText("Cannot pay to self");
    setLoading(true);
    const { status, data, error } = await detailsAPI({ phoneNumber: number });
    if (error) {
      if (status === 404) {
        SetErrorText("Contact not registered on ScanNpay");
      } else {
        SetErrorText("An error occurred");
      }
    } else {
      navigateToTransferAmount(data);
    }
    setLoading(false);
  };

  const navigation = useNavigation();

  const navigateToTransferAmount = (details) => {
    navigation.navigate("TransferAmount", { details });
  };

  return (
    <View style={styles.container}>
      <Avatar display={getAvatarText(name)} phoneNumber={number} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{truncateString(name)}</Text>
        <Text style={styles.number}>
          {contact.phoneNumber || contact.phoneNumbers[0].number}
        </Text>
        {errorText && <Text style={styles.error}>{errorText}</Text>}
      </View>
      {contact.receiver_id ? (
        <View style={styles.buttonContainer}>
          <TextButton
            fontFamily="RobotoMedium"
            fontSize={12}
            onPress={() => navigateToTransferAmount(contact)}
          >
            Pay
          </TextButton>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : errorText ? (
            ""
          ) : (
            <TextButton
              fontFamily="RobotoMedium"
              fontSize={12}
              onPress={getDetails}
            >
              Pay
            </TextButton>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
  },
  nameContainer: {
    marginHorizontal: 10,
    height: 48,
    justifyContent: "center",
  },
  name: {
    color: colors.secondary,
    fontFamily: "RobotoMedium",
    fontSize: 14,
  },
  number: {
    color: colors.textLight,
    fontFamily: "RobotoRegular",
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    fontFamily: "RobotoItalic",
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
  },
  buttonContainer: {
    marginLeft: "auto",
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

const getAvatarText = (name) => {
  const names = name.split(" ");
  let text = "";
  text += names[0].charAt(0);
  if (names.length > 1) text += names[names.length - 1].charAt(0);
  else text += names[0].charAt(names[0].length - 1);
  return text.toUpperCase();
};

function truncateString(str) {
  if (str.length > 25) {
    return str.substring(0, 22) + "...";
  } else {
    return str;
  }
}
