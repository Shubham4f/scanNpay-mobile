import { useState, useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  PrimaryButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import { PinInput } from "../../components/inputs/index.js";
import { LoadingOverlay, AlertBox } from "../../components/popups/index.js";
import Avatar from "../../components/Avatar.js";
import { transferAPI, withdrawAPI } from "../../apis/securedAPIs.js";
import { convertToIndianWords } from "../../utils/index.js";
import { Formik } from "formik";
import AppContext from "../../context/AppContext.js";
import * as yup from "yup";
import colors from "../../global/colors.js";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  Keyboard,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";

const pinSchema = yup.object({
  paymentPin: yup
    .string()
    .required("Payment PIN is required")
    .matches(/^\d{4}$/, "Payment PIN must be exactly 4 digits"),
});

export default function TransferPin({ navigation, route }) {
  const { details } = route.params;

  const { user } = useContext(AppContext);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToTransactionDetails = (transaction) => {
    navigation.navigate("TransactionNavigator", {
      screen: "TransactionDetails",
      params: { transaction },
    });
  };
  const onSubmit = async (values) => {
    setLoading(true);
    Keyboard.dismiss();
    if (details.isTransfer) {
      var { status, data, error } = await transferAPI({
        receiver_id: details.receiver_id,
        amount: details.amount,
        paymentPin: values.paymentPin,
      });
    } else {
      var { status, data, error } = await withdrawAPI({
        beneficiary: details.beneficiary,
        accountNumber: details.accountNumber,
        ifsc: details.ifsc,
        amount: details.amount,
        paymentPin: values.paymentPin,
      });
    }
    if (error) {
      if (status === 403) {
        setAlertTitle("Invalid payment Pin!");
        setAlertMessage(
          "The payment PIN you have entered is wrong. Please try again."
        );
      } else if (status >= 500 && status < 600) {
        setAlertTitle("Internal Server Error!");
        setAlertMessage(
          "Oops! Something went wrong on our end. Please try again later or contact support for assistance."
        );
      } else {
        setAlertTitle("Error!");
        setAlertMessage("An error occurred. Please try again later.");
      }
      setAlertVisible(true);
    } else {
      navigateToTransactionDetails(data);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <Formik
          initialValues={{
            paymentPin: "",
          }}
          validationSchema={pinSchema}
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
                <Text style={styles.pageTitleText}>
                  {details.isTransfer ? "Sending Money" : "Withdrawing Money"}
                </Text>
                {details.isTransfer ? (
                  <>
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
                      <Text style={{ color: colors.primary }}>
                        Phone Number
                      </Text>
                      {" : "}
                      {details.phoneNumber}
                    </Text>
                    <Text style={styles.pageSubTitleText}>
                      ₹{details.amount.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.words}>
                      Rupees {convertToIndianWords(details.amount)} Only
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={styles.avatar}>
                      <Avatar
                        display="W"
                        phoneNumber={user.phoneNumber}
                        size={64}
                      />
                    </View>
                    <Text style={styles.pageSubTitleText}>
                      <Text style={{ color: colors.primary }}>To</Text>
                      {` : ${details.beneficiary} `}
                    </Text>
                    <Text style={styles.pageSubTitleText}>
                      <Text style={{ color: colors.primary }}>
                        Account Number
                      </Text>
                      {" : "}
                      {details.accountNumber}
                    </Text>
                    <Text style={styles.pageSubTitleText}>
                      ₹{details.amount.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.words}>
                      Rupees {convertToIndianWords(details.amount)} Only
                    </Text>
                  </>
                )}
                <View style={styles.innerFormContainer}>
                  {/* Pin Input */}
                  <PinInput
                    name="paymentPin"
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </View>
                <PrimaryButton onPress={handleSubmit}>Pay</PrimaryButton>
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
