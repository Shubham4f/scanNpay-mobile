import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../buttons/index.js";
import TransactionListItem from "./TransactionListItem.js";
import { historyAPI } from "../../apis/securedAPIs.js";
import { Feather } from "@expo/vector-icons";
import colors from "../../global/colors.js";

const { height } = Dimensions.get("window");

export default function RecentTransactions() {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const callHistory = async () => {
    setHistoryLoading(true);
    const { status, data, error } = await historyAPI({ page: 1, limit: 5 });
    if (!error) {
      setHistory(data);
      setHistoryLoading(false);
    }
  };
  useEffect(() => {
    callHistory();
  }, []);
  const navigation = useNavigation();
  const navigateToHistory = () => {
    navigation.navigate("TransactionNavigator");
  };

  return (
    <View
      style={[
        styles.transContainer,
        (history.length === 0 || historyLoading) && {
          minHeight: height * 0.4,
        },
      ]}
    >
      <View style={styles.transHeadingContainer}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
          onPress={callHistory}
        >
          <Text style={styles.transHeading}>Recent transactions </Text>
          <Feather name="refresh-cw" size={14} color={colors.textLight} />
        </Pressable>
        <TextButton
          fontFamily="RobotoMedium"
          fontSize={14}
          color={colors.secondary}
          onPress={navigateToHistory}
        >
          All{" "}
          <Feather name="chevron-right" size={14} color={colors.secondary} />
        </TextButton>
      </View>
      <View style={styles.transInnerContainer}>
        {historyLoading ? (
          <ActivityIndicator color={colors.secondary} size="large" />
        ) : history.length === 0 ? (
          <Text style={[styles.transHeading, { fontFamily: "RobotoItalic" }]}>
            No recent transactions
          </Text>
        ) : (
          history.map((element, index) => (
            <View key={element._id}>
              <TransactionListItem transaction={element} />

              {index !== history.length - 1 && (
                <View style={styles.separator}></View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transContainer: {
    marginVertical: 25,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
    alignItems: "center",
  },
  transHeadingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transHeading: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    color: colors.textLight,
  },
  transInnerContainer: {
    paddingTop: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
  },
});
