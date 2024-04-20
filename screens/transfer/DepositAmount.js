import { useState, useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  PrimaryButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import { AmountInput } from "../../components/inputs/index.js";
import { LoadingOverlay, AlertBox } from "../../components/popups/index.js";
import Avatar from "../../components/Avatar.js";
import { depositAPI, verifyAPI } from "../../apis/securedAPIs.js";
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
  Keyboard,
  StatusBar,
  Platform,
} from "react-native";
import AppContext from "../../context/AppContext.js";
import RazorpayCheckout from "react-native-razorpay";

const amountSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .min(1, "Amount must be greater than or equal to ₹1")
    .max(10000, "Amount must be less than or equal to 10,000"),
});

export default function DepositAmount({ navigation }) {
  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToTransactionDetails = (transaction) => {
    navigation.navigate("TransactionNavigator", {
      screen: "TransactionDetails",
      params: { transaction },
    });
  };

  const pay = async (order) => {
    const options = {
      description: "Deposit money into scanNpay account.",
      currency: "INR",
      key: process.env.EXPO_PUBLIC_RAZORPAY_API_KEY,
      amount: order.amount,
      name: "ScanNpay",
      order_id: order.id,
      prefill: {
        contact: user.phoneNumber,
        name: `${user.firstName} ${user.lastName} `,
      },
      theme: { color: colors.primary },
    };
    try {
      var value = await RazorpayCheckout.open(options);
    } catch (error) {
      setAlertTitle("Error!");
      setAlertMessage("Transaction failed.");
      setAlertVisible(true);
      setLoading(false);
    }
    const { status, data, error } = await verifyAPI({
      razorpay_payment_id: value.razorpay_payment_id,
      razorpay_signature: value.razorpay_signature,
    });
    if (error) {
      setAlertTitle("Error!");
      setAlertMessage("Transaction failed.");
      setAlertVisible(true);
      setLoading(false);
    } else {
      navigateToTransactionDetails(data);
    }
  };

  const onSubmit = async (values) => {
    Keyboard.dismiss();
    setLoading(true);
    const { status, data, error } = await depositAPI({
      amount: +values.amount,
    });
    if (error) {
      setAlertTitle("Error!");
      setAlertMessage("An error occurred. Please try again later.");
      setAlertVisible(true);
      setLoading(false);
    } else {
      pay(data);
    }
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
                <Text style={styles.pageTitleText}>Add Money</Text>
                <View style={styles.avatar}>
                  <Avatar
                    display={`${user.firstName.charAt(0)}${user.lastName.charAt(
                      0
                    )}`}
                    phoneNumber={user.phoneNumber}
                    size={64}
                  />
                </View>
                <Text style={styles.pageSubTitleText}>
                  {`${user.firstName} ${user.lastName} `}
                </Text>
                <Text style={styles.pageSubTitleText}>{user.phoneNumber}</Text>
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
                <PrimaryButton onPress={handleSubmit}>Add</PrimaryButton>
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <AlertBox
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        setVisible={setAlertVisible}
      />
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
