import { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { SqaureBackButton } from "../../components/buttons/index.js";
import { Avatar } from "../../components/index.js";
import AppContext from "../../context/AppContext.js";
import { convertToIndianWords } from "../../utils/index.js";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import colors from "../../global/colors.js";

export default function TransactionDetails({ navigation, route }) {
  const { transaction } = route.params;
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

  const AmountSection = () => {
    return (
      <View style={[styles.section]}>
        <Text style={styles.heading}>Amount</Text>
        <Text style={styles.valueText}>
          ₹{transaction.amount.toLocaleString("en-IN")}{" "}
          {transaction.status === "failed" ? (
            <Feather name="alert-circle" size={20} color={colors.danger} />
          ) : transaction.status === "processing" ? (
            <Feather name="alert-circle" size={20} color={colors.processing} />
          ) : (
            ""
          )}
        </Text>
        <Text style={[styles.subText, { fontFamily: "RobotoItalic" }]}>
          Rupees {convertToIndianWords(transaction.amount)} Only
        </Text>
      </View>
    );
  };

  const OtherUserSection = () => {
    if (transaction.type === "transfer") {
      return (
        <View style={styles.section}>
          <Text style={styles.heading}>{info.sent ? "To" : "From"}</Text>
          <View style={styles.innerSection}>
            <View>
              <Text style={styles.valueText}>{info.name}</Text>
              <Text style={styles.subText}>
                <Text style={styles.texthighlight}>Phone number</Text> :{" "}
                {info.phoneNumber}
              </Text>
            </View>
            <Avatar display={info.avatar} phoneNumber={info.phoneNumber} />
          </View>
        </View>
      );
    } else if (transaction.type === "withdraw") {
      return (
        <View style={styles.section}>
          <View style={styles.innerSection}>
            <View>
              <Text style={styles.valueText}>{info.name}</Text>
              <Text style={styles.subText}>
                <Text style={styles.texthighlight}>Beneficiary</Text> :{" "}
                {transaction.beneficiary}
              </Text>
              <Text style={styles.subText}>
                <Text style={styles.texthighlight}>A/C</Text> :{" "}
                {transaction.accountNumber}
              </Text>
              <Text style={styles.subText}>
                <Text style={styles.texthighlight}>UTR</Text> :{" "}
                {transaction.utr}
              </Text>
            </View>
            <Avatar display="W" phoneNumber={info.phoneNumber} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <View style={styles.innerSection}>
            <View>
              <Text style={styles.valueText}>{info.name}</Text>
              <Text style={styles.subText}>
                <Text style={styles.texthighlight}>Razorpay Ref </Text> :{" "}
                {transaction.razorpayOrderId}
              </Text>
            </View>
            <Avatar display="D" phoneNumber={info.phoneNumber} />
          </View>
        </View>
      );
    }
  };

  const UserSection = () => {
    return (
      <View style={[styles.section, { borderBottomWidth: 0 }]}>
        <Text style={styles.heading}>{info.sent ? "From" : "To"}</Text>
        <View style={styles.innerSection}>
          <View>
            <Text
              style={styles.valueText}
            >{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.subText}>
              <Text style={styles.texthighlight}>Phone number</Text> :{" "}
              {user.phoneNumber}
            </Text>
            <Text style={styles.subText}>
              <Text style={styles.texthighlight}>Ref No</Text> :{" "}
              {transaction._id}
            </Text>
            <Text style={styles.subText}>
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
          <Avatar
            display={`${user.firstName[0]}${user.lastName[0]}`}
            phoneNumber={user.phoneNumber}
          />
        </View>
      </View>
    );
  };

  const navigateBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
      >
        <SqaureBackButton onPress={navigateBack} />
        <Text
          style={[
            styles.valueText,
            { marginLeft: "auto", marginRight: "auto" },
          ]}
        >
          {transaction.status === "failed"
            ? "Failed"
            : transaction.status === "processing"
            ? "Processing"
            : info.sent
            ? "Paid Successfully"
            : "Money Received"}
        </Text>
        <View style={styles.groupContainer}>
          <AmountSection />
          <OtherUserSection />
          <UserSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    paddingVertical: 32,
    borderColor: colors.stroke,
  },
  innerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    color: colors.balck,
    fontFamily: "RobotoMedium",
    fontSize: 12,
  },
  valueText: {
    color: colors.secondary,
    fontFamily: "RobotoBold",
    fontSize: 24,
    marginTop: 4,
    marginTop: 12,
  },
  subText: {
    color: colors.balck,
    fontFamily: "RobotoMedium",
    fontSize: 12,
    marginTop: 12,
  },
  texthighlight: {
    color: colors.primary,
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
  groupContainer: {
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
    marginTop: 24,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
  },
});
