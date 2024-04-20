import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/AppContext.js";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { TransactionListItem } from "../../components/transaction/index.js";
import { historyAPI } from "../../apis/securedAPIs.js";
import colors from "../../global/colors.js";

const { height } = Dimensions.get("window");

function TransHeader() {
  return (
    <View style={styles.transHeadingContainer}>
      <Text style={styles.transHeading}>All transactions</Text>
    </View>
  );
}

function Separator() {
  return <View style={styles.separator}></View>;
}

export default function TransactionHistory() {
  const { user } = useContext(AppContext);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isMore, setIsMore] = useState(true);
  const [page, setPage] = useState(0);

  const limit = 10;

  useEffect(() => {
    const callHistory = async () => {
      const { status, data, error } = await historyAPI({ page, limit });
      if (!error) {
        setHistory((prev) => [...prev, ...data]);
        setHistoryLoading(false);
        if (data.length % limit !== 0 || data.length === 0) setIsMore(false);
      }
    };
    callHistory();
  }, [page]);

  const ListEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {historyLoading ? (
          <ActivityIndicator color={colors.secondary} size="large" />
        ) : (
          <>
            <Text style={[styles.transHeading, { fontFamily: "RobotoItalic" }]}>
              No transactions yet.
            </Text>
            <Text style={[styles.transHeading, { fontFamily: "RobotoItalic" }]}>
              Start scanning today with scanNpay!
            </Text>
          </>
        )}
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {history.length === 0 ? (
          <></>
        ) : isMore ? (
          <ActivityIndicator color={colors.secondary} size="large" />
        ) : (
          <Text style={[styles.transHeading, { fontFamily: "RobotoItalic" }]}>
            No more transactions.
          </Text>
        )}
      </View>
    );
  };
  const onEndReached = () => {
    if (isMore) setPage((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Transaction history</Text>
          <Text style={styles.account}>Account : {user.phoneNumber} </Text>
        </View>
        <FlatList
          ListHeaderComponent={TransHeader}
          ListEmptyComponent={ListEmptyComponent}
          data={history}
          renderItem={({ item }) => <TransactionListItem transaction={item} />}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.transContainer,
            (history.length === 0 || historyLoading) && {
              minHeight: height - 150,
            },
          ]}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight + 8,
      },
      ios: {
        paddingTop: 8,
      },
    }),
  },
  innerContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 10,
  },
  headerText: {
    color: colors.secondary,
    fontSize: 24,
    fontFamily: "RobotoBold",
  },
  account: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: "RobotoMedium",
    marginTop: 4,
  },
  transContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
  },
});
