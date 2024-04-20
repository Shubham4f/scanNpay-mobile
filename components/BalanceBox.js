import { useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { balanceAPI } from "../apis/securedAPIs.js";
import { Feather } from "@expo/vector-icons";
import colors from "../global/colors.js";

export default function BalanceBox() {
  const [balance, setBalance] = useState(null);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const getBalance = async () => {
    setBalanceLoading(true);
    const { status, data, error } = await balanceAPI();
    if (!error) {
      setBalance(data.balance.toLocaleString("en-IN"));
      setBalanceLoading(false);
    }
  };
  return (
    <View style={styles.balanceContainer}>
      <Text style={styles.balanceHeading}>Balance : </Text>
      {balanceVisible ? (
        <View style={styles.balanceInnerContainer}>
          {balanceLoading ? (
            <>
              <Text style={styles.balanceText}>₹ . . . . .</Text>
            </>
          ) : (
            <Text style={styles.balanceText}>₹{balance}</Text>
          )}
          <Pressable onPress={() => setBalanceVisible(false)}>
            <Feather name="eye" size={24} color={colors.white} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.balanceInnerContainer}>
          <Text style={styles.balanceText}>₹XX,XXX</Text>
          <Pressable
            onPress={() => {
              getBalance();
              setBalanceVisible(true);
            }}
          >
            <Feather name="eye-off" size={24} color={colors.white} />
          </Pressable>
        </View>
      )}
      <View style={styles.balanceLowerContainer}>
        <Text style={styles.balanceLowerText}>scanNpay </Text>
        <Image
          style={styles.balanceLowerImage}
          source={require("../assets/icons/icon-crop.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    marginTop: 25,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  balanceHeading: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    color: colors.white,
  },
  balanceInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  balanceText: {
    fontFamily: "RobotoMedium",
    fontSize: 24,
    color: colors.white,
  },
  balanceLowerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  balanceLowerText: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    color: colors.white,
  },
  balanceLowerImage: {
    height: 24,
    width: 24,
  },
});
