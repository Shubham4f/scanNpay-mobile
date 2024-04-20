import { useState, useLayoutEffect, useRef, useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import AppContext from "../../context/AppContext.js";
import {
  SafeAreaView,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  StatusBar,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { PrimaryButton, TextButton } from "../../components/buttons/index.js";
import {
  TextInputLarge,
  PasswordInput,
} from "../../components/inputs/index.js";
import {
  LoadingOverlay,
  AlertBox,
  OTPModal,
} from "../../components/popups/index.js";
import { sendOTPAPI, signUpAPI } from "../../apis/authAPIs.js";
import { Formik } from "formik";
import * as yup from "yup";
import colors from "../../global/colors.js";

const { height } = Dimensions.get("window");

const userSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must be at most 20 characters")
    .matches(/^[a-zA-Z]+$/, "First name can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must be at most 20 characters")
    .matches(/^[a-zA-Z]+$/, "Last name can only contain letters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(
      /^[^\uD83C-\uDBFF\uDC00-\uDFFF]+$/,
      "Password cannot contain emojis"
    ),
  paymentPin: yup
    .string()
    .required("Payment PIN is required")
    .matches(/^\d{4}$/, "Payment PIN must be exactly 4 digits"),
});

export default function SignUp({ navigation, route }) {
  useLayoutEffect(() => {
    if (route.params?.pop)
      navigation.setOptions({ animationTypeForReplace: "pop" });
  }, []);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const paymentPinRef = useRef(null);

  const [user, setUser] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [OTPModalVisible, setOTPModalVisible] = useState(false);

  const { signInSave } = useContext(AppContext);

  const navigateToSignIn = () => {
    navigation.replace("SignIn");
  };

  const modalBack = () => {
    setLoading(false);
    setOTPModalVisible(false);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setUser(values);
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
      setOTPModalVisible(true);
    }
  };

  const onSuccessOTP = async (data) => {
    await signInSave(data);
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
            firstName: "",
            lastName: "",
            phoneNumber: "",
            password: "",
            paymentPin: "",
          }}
          validationSchema={userSchema}
          onSubmit={(values) => {
            onSubmit(values);
          }}
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
                <View>
                  <Text style={styles.pageTitleText}>
                    Create a{" "}
                    <Text style={{ color: colors.primary }}>ScanNpay</Text>
                  </Text>
                  <Text style={[styles.pageTitleText, { marginTop: 0 }]}>
                    account
                  </Text>
                  <View style={styles.innerFormContainer}>
                    {/* firstName Input */}
                    <TextInputLarge
                      name="firstName"
                      placeHolder="First Name"
                      ref={firstNameRef}
                      nextRef={lastNameRef}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      editable={!loading}
                      keyboardType="default"
                      returnKeyType="next"
                      autoCapitalize="words"
                      autoComplete="given-name"
                      autoCorrect={false}
                    />
                    {/* lastName Input */}
                    <TextInputLarge
                      name="lastName"
                      placeHolder="Last Name"
                      ref={lastNameRef}
                      nextRef={phoneNumberRef}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      editable={!loading}
                      keyboardType="default"
                      returnKeyType="next"
                      autoCapitalize="words"
                      autoComplete="family-name"
                      autoCorrect={false}
                    />
                    {/* phoneNumber Input */}
                    <TextInputLarge
                      name="phoneNumber"
                      placeHolder="Phone Number"
                      ref={phoneNumberRef}
                      nextRef={passwordRef}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      editable={!loading}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoComplete="tel"
                      autoCorrect={false}
                    />
                    {/* password Input */}
                    <PasswordInput
                      name="password"
                      placeHolder="Password"
                      ref={passwordRef}
                      nextRef={paymentPinRef}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      editable={!loading}
                      keyboardType="default"
                      returnKeyType="next"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect={false}
                    />
                    {/* paymentPin Input */}
                    <PasswordInput
                      name="paymentPin"
                      placeHolder="Payment PIN"
                      ref={paymentPinRef}
                      values={values}
                      touched={touched}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      editable={!loading}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect={false}
                    />
                  </View>
                  <PrimaryButton onPress={handleSubmit}>Sign Up</PrimaryButton>
                </View>
                <View style={styles.bottmTextContainer}>
                  <Text style={styles.bottomText}>
                    Already have an account?{" "}
                  </Text>
                  <TextButton onPress={navigateToSignIn}>Sign In</TextButton>
                </View>
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
        user={user}
        api={signUpAPI}
        onSuccessOTP={onSuccessOTP}
        onFailureOTP={onFailureOTP}
      />
      <ExpoStatusBar style="dark" backgroundColor={colors.white} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
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
    justifyContent: "space-between",
  },
  pageTitleText: {
    marginTop: 22,
    color: colors.secondary,
    fontSize: 24,
    fontFamily: "RobotoBold",
  },
  innerFormContainer: {
    marginVertical: 32,
  },
  bottmTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  bottomText: {
    color: colors.textLight,
    fontFamily: "RobotoRegular",
    fontSize: 16,
  },
});
