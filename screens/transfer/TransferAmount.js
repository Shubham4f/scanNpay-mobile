import { useState, useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  PrimaryButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import { AmountInput } from "../../components/inputs/index.js";
import { LoadingOverlay } from "../../components/popups/index.js";
import Avatar from "../../components/Avatar.js";
import { balanceAPI } from "../../apis/securedAPIs.js";
import { convertToIndianWords } from "../../utils/index.js";
import { Formik } from "formik";
import * as yup from "yup";
import colors from "../../global/colors.js";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";

export default function TransferAmount({ navigation, route }) {
  const { details } = route.params;

  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const { status, data, error } = await balanceAPI();
    if (!error) {
      setBalance(data.balance);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  if (balance < 10000 && balance > 0) {
    var amountSchema = yup.object({
      amount: yup
        .number()
        .required("Amount is required")
        .min(1, "Amount must be greater than or equal to ₹1")
        .max(
          balance,
          `Amount must be less than or equal to ₹${balance.toLocaleString(
            "en-IN"
          )}`
        ),
    });
  } else if (balance === 0) {
    var amountSchema = yup.object({
      amount: yup
        .number()
        .required("Amount is required")
        .min(1, "Amount must be greater than or equal to ₹1")
        .max(0, "Your account balance is currently at ₹0"),
    });
  } else {
    var amountSchema = yup.object({
      amount: yup
        .number()
        .required("Amount is required")
        .min(1, "Amount must be greater than or equal to ₹1")
        .max(10000, "Amount must be less than or equal to 10,000"),
    });
  }
  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToTransferPin = (amount) => {
    navigation.navigate("TransferPin", {
      details: { ...details, amount, isTransfer: true },
    });
  };
  const onSubmit = (values) => {
    navigateToTransferPin(+values.amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <Formik
          initialValues={{
            amount: "",
          }}
          validationSchema={amountSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors,
          }) => (
            <ScrollView
              style={styles.formContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.form}>
                <SqaureBackButton onPress={navigateBack} />
                <Text style={styles.pageTitleText}>Send Money</Text>
                <View style={styles.avatar}>
                  <Avatar
                    display={`${details.firstName.charAt(
                      0
                    )}${details.lastName.charAt(0)}`}
                    phoneNumber={details.phoneNumber}
                    size={64}
                  />
                </View>
                <Text style={styles.pageSubTitleText}>
                  <Text style={{ color: colors.primary }}>To</Text>
                  {` : ${details.firstName} ${details.lastName} `}
                </Text>
                <Text style={styles.pageSubTitleText}>
                  <Text style={{ color: colors.primary }}>Phone Number</Text>
                  {" : "}
                  {details.phoneNumber}
                </Text>
                <View style={styles.innerFormContainer}>
                  {/* Amount Input */}
                  <AmountInput
                    name="amount"
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                  {values.amount && values.amount <= 10000 && (
                    <Text style={styles.words}>
                      Rupees {convertToIndianWords(values.amount)} Only
                    </Text>
                  )}
                </View>
                <PrimaryButton onPress={handleSubmit}>Procced</PrimaryButton>
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <LoadingOverlay loading={loading} />
      <ExpoStatusBar style="dark" backgroundColor="#fff" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
    backgroundColor: colors.white,
  },
  formContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  form: {
    flex: 1,
  },
  pageTitleText: {
    marginTop: 22,
    color: colors.secondary,
    fontSize: 24,
    fontFamily: "RobotoBold",
    marginLeft: "auto",
    marginRight: "auto",
  },
  avatar: {
    marginTop: 22,
    marginLeft: "auto",
    marginRight: "auto",
  },
  pageSubTitleText: {
    fontFamily: "RobotoMedium",
    fontSize: 16,
    marginTop: 4,
    color: colors.balck,
    marginLeft: "auto",
    marginRight: "auto",
  },
  words: {
    color: colors.balck,
    fontFamily: "RobotoItalic",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: "auto",
    marginRight: "auto",
  },
  innerFormContainer: {
    marginVertical: 32,
  },
});
