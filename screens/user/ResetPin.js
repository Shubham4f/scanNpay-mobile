import { useState, useRef, useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import {
  PrimaryButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import { PasswordInput } from "../../components/inputs/index.js";
import {
  LoadingOverlay,
  AlertBox,
  OTPModal,
} from "../../components/popups/index.js";
import AppContext from "../../context/AppContext.js";
import { sendOTPAPI } from "../../apis/authAPIs.js";
import { resetPaymentPinAPI } from "../../apis/securedAPIs.js";
import { Formik } from "formik";
import * as yup from "yup";
import colors from "../../global/colors.js";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

const userSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number"),
  paymentPin: yup
    .string()
    .required("Payment PIN is required")
    .matches(/^\d{4}$/, "Payment PIN must be exactly 4 digits"),
});

export default function ResetPin({ navigation }) {
  const { user } = useContext(AppContext);

  const passwordRef = useRef(null);

  const [fromUser, setFromUser] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [OTPModalVisible, setOTPModalVisible] = useState(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const modalBack = () => {
    setLoading(false);
    setOTPModalVisible(false);
  };

  const onSubmit = async (values, resetForm) => {
    setLoading(true);
    setFromUser(values);
    Keyboard.dismiss();
    const { status, data, error } = await sendOTPAPI(values);
    if (error) {
      if (status >= 500 && status < 600) {
        setAlertTitle("Internal Server Error!");
        setAlertMessage(
          "Oops! Something went wrong on our end. Please try again later or contact support for assistance."
        );
      } else {
        setAlertTitle("Error!");
        setAlertMessage("An error occurred. Please try again later.");
      }
      setAlertVisible(true);
      setLoading(false);
    } else {
      resetForm();
      setOTPModalVisible(true);
    }
  };

  const onSuccessOTP = async (data) => {
    setAlertTitle("Pin Reset Successful!");
    setAlertMessage("Your payment pin has been successfully reset. ");
    setAlertVisible(true);
  };

  const onFailureOTP = async (error) => {
    setAlertTitle(error.title);
    setAlertMessage(error.message);
    setAlertVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <Formik
          initialValues={{
            phoneNumber: user.phoneNumber,
            paymentPin: "",
          }}
          validationSchema={userSchema}
          onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
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
                <Image
                  style={styles.imageIcon}
                  source={require("../../assets/icons/lock-green-bg.png")}
                />
                <Text style={styles.pageTitleText}>Payment Pin Recovery</Text>
                <Text style={styles.pageSubTitleText}>
                  Enter your new payment pin below.
                </Text>
                <View style={styles.innerFormContainer}>
                  {/* password Input */}
                  <PasswordInput
                    name="paymentPin"
                    placeHolder="New Payment Pin"
                    ref={passwordRef}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editable={!loading}
                    keyboardType="default"
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                  />
                </View>
                <PrimaryButton onPress={handleSubmit}>Send Code</PrimaryButton>
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
      <OTPModal
        visible={OTPModalVisible}
        goBack={modalBack}
        user={fromUser}
        api={resetPaymentPinAPI}
        onSuccessOTP={onSuccessOTP}
        onFailureOTP={onFailureOTP}
      />
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
    minHeight: height,
  },
  formContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  form: {
    ...Platform.select({
      android: { minHeight: height },
      ios: {
        minHeight: height - Constants.statusBarHeight - 20,
      },
    }),
    flex: 1,
  },
  imageIcon: {
    marginTop: 22,
    height: 77,
    width: 88,
  },
  pageTitleText: {
    marginTop: 22,
    color: colors.secondary,
    fontSize: 24,
    fontFamily: "RobotoBold",
  },
  pageSubTitleText: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 16,
    fontFamily: "RobotoRegular",
  },
  innerFormContainer: {
    marginVertical: 32,
  },
});
