import { useContext } from "react";
import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "../index.js";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import AppContext from "../../context/AppContext.js";
import colors from "../../global/colors.js";

export default function TransactionListItem({ transaction }) {
  const { user } = useContext(AppContext);
  let info = {};
  if (transaction.type === "transfer") {
    if (transaction.senderRef.phoneNumber === user.phoneNumber)
      info = {
        name: `${transaction.receiverRef.firstName} ${transaction.receiverRef.lastName}`,
        avatar: `${transaction.receiverRef.firstName[0]}${transaction.receiverRef.lastName[0]}`,
        phoneNumber: transaction.receiverRef.phoneNumber,
        sent: true,
      };
    else
      info = {
        name: `${transaction.senderRef.firstName} ${transaction.senderRef.lastName}`,
        avatar: `${transaction.senderRef.firstName[0]}${transaction.senderRef.lastName[0]}`,
        phoneNumber: transaction.senderRef.phoneNumber,
        sent: false,
      };
  } else if (transaction.type === "deposit")
    info = {
      name: "Deposit",
      avatar: `${user.firstName[0]}${user.lastName[0]}`,
      phoneNumber: user.phoneNumber,
      sent: false,
    };
  else
    info = {
      name: "Withdraw",
      avatar: `${user.firstName[0]}${user.lastName[0]}`,
      phoneNumber: user.phoneNumber,
      sent: true,
    };
  const navigation = useNavigation();
  const navigateToTransactionDetails = () => {
    navigation.navigate("TransactionNavigator", {
      screen: "TransactionDetails",
      params: { transaction },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed ? styles.pressed : ""]}
      onPress={navigateToTransactionDetails}
    >
      <Avatar display={info.avatar} phoneNumber={info.phoneNumber} />
      <View style={styles.nameContainer}>
        <Text
          style={[
            styles.name,
            transaction.status === "failed" ? { color: colors.textLight } : {},
          ]}
        >
          {truncateString(info.name)}{" "}
          {info.sent ? (
            <Feather
              name="arrow-up-right"
              size={14}
              color={
                transaction.status === "failed"
                  ? colors.textLight
                  : colors.secondary
              }
            />
          ) : (
            <Feather
              name="arrow-down-left"
              size={14}
              color={
                transaction.status === "failed"
                  ? colors.textLight
                  : colors.secondary
              }
            />
          )}
        </Text>
        <Text style={styles.date}>
          {transaction.status === "processing"
            ? "Processing from "
            : transaction.status === "failed"
            ? "Failed on "
            : info.sent
            ? "Sent on "
            : "Received on "}
          {moment(transaction.updatedAt)
            .utcOffset("+05:30")
            .format("MMMM Do, h:mm A")}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        {transaction.status === "processing" ? (
          <>
            <Text style={[styles.amount, { color: colors.processing }]}>
              ₹{transaction.amount.toLocaleString("en-IN")}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, { color: colors.processing }]}>
                Processing
              </Text>
            </View>
          </>
        ) : transaction.status === "failed" ? (
          <>
            <Text style={[styles.amount, { color: colors.textLight }]}>
              ₹{transaction.amount.toLocaleString("en-IN")}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, { color: colors.textLight }]}>
                Failed
              </Text>
            </View>
          </>
        ) : info.sent ? (
          <>
            <Text style={styles.amount}>
              - ₹{transaction.amount.toLocaleString("en-IN")}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>From</Text>
              <Image
                style={styles.icon}
                source={require("../../assets/icons/icon-crop.png")}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.amount, { color: colors.primary }]}>
              + ₹{transaction.amount.toLocaleString("en-IN")}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>In</Text>
              <Image
                style={styles.icon}
                source={require("../../assets/icons/icon-crop.png")}
              />
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
  },
  pressed: {
    opacity: 0.7,
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
  date: {
    color: colors.textLight,
    fontFamily: "RobotoRegular",
    fontSize: 10,
    marginTop: 2,
  },
  amountContainer: {
    marginLeft: "auto",
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  amount: {
    color: colors.secondary,
    fontFamily: "RobotoMedium",
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  iconText: {
    color: colors.textLight,
    fontFamily: "RobotoRegular",
    fontSize: 10,
  },
  icon: {
    height: 14,
    width: 14,
    marginLeft: 2,
  },
});

function truncateString(str) {
  if (str.length > 25) {
    return str.substring(0, 22) + "...";
  } else {
    return str;
  }
}
