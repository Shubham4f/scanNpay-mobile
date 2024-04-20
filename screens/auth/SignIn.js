import { useState, useContext, useRef } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import AppContext from "../../context/AppContext.js";
import { PrimaryButton, TextButton } from "../../components/buttons/index.js";
import {
  TextInputLarge,
  PasswordInput,
} from "../../components/inputs/index.js";
import { LoadingOverlay, AlertBox } from "../../components/popups/index.js";
import { signInAPI } from "../../apis/authAPIs.js";
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
  Keyboard,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

const userSchema = yup.object({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^[^\uD83C-\uDBFF\uDC00-\uDFFF]+$/,
      "Password cannot contain emojis"
    ),
});

export default function SignIn({ navigation }) {
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateToSignUp = () => {
    navigation.replace("SignUp", { pop: true });
  };
  const navigateToResetPassword = () => {
    navigation.navigate("RestPassword");
  };

  const { signInSave } = useContext(AppContext);

  const onSubmit = async (values) => {
    setLoading(true);
    Keyboard.dismiss();
    const { status, data, error } = await signInAPI(values);
    if (error) {
      if (status === 401) {
        setAlertTitle("Invalid credentials!");
        setAlertMessage("Please verify your phone number and password.");
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
      await signInSave(data);
    }
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <Formik
          initialValues={{
            phoneNumber: "",
            password: "",
          }}
          validationSchema={userSchema}
          onSubmit={(values) => onSubmit(values)}
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
                  <Text style={styles.pageTitleText}>Hi There! 👋</Text>
                  <Text style={styles.pageSubTitleText}>
                    Welcome back, Sign in to your account.
                  </Text>
                  <View style={styles.innerFormContainer}>
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
                    <View style={{ marginTop: 24 }}>
                      <TextButton onPress={navigateToResetPassword}>
                        Forgot Password?
                      </TextButton>
                    </View>
                  </View>
                  <PrimaryButton onPress={handleSubmit}>Sign In</PrimaryButton>
                </View>
                <View style={styles.bottmTextContainer}>
                  <Text style={styles.bottomText}>Don’t have an account? </Text>
                  <TextButton onPress={navigateToSignUp}>Sign Up</TextButton>
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
  pageSubTitleText: {
    marginTop: 8,
    color: colors.textLight,
    fontSize: 16,
    fontFamily: "RobotoRegular",
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
