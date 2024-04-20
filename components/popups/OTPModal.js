import { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
} from "react-native";
import {
  SqaureBackButton,
  PrimaryButton,
  TextButton,
} from "../buttons/index.js";
import { PasswordInput } from "../inputs/index.js";
import LoadingOverlay from "./LoadingOverlay.js";
import AlertBox from "./AlertBox.js";
import { sendOTPAPI } from "../../apis/authAPIs.js";
import { Formik } from "formik";
import * as yup from "yup";
import colors from "../../global/colors.js";

const otpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export default function OTPModal({
  visible,
  goBack,
  user,
  api,
  onSuccessOTP,
  onFailureOTP,
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRef = useRef(null);

  const resendOTP = async () => {
    setLoading(true);
    Keyboard.dismiss();
    const { status, data, error } = await sendOTPAPI(user);
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
    } else {
      setAlertTitle("OTP Resent!");
      setAlertMessage(
        "Your OTP has been resent successfully. Please check your phone for the new OTP."
      );
    }
    setAlertVisible(true);
    setLoading(false);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    Keyboard.dismiss();
    const { status, data, error } = await api({ ...user, ...values });
    if (error) {
      if (status === 410) {
        setAlertTitle("OTP Expired!");
        setAlertMessage(
          "The time limit for the OTP has expired or the maximum number of attempts has been reached. Please generate a new OTP."
        );
        setAlertVisible(true);
      } else if (status === 400) {
        setAlertTitle("Invalid OTP!");
        setAlertMessage(
          "The OTP you entered is invalid. Please check and try again."
        );
        setAlertVisible(true);
      } else if (status === 409) {
        onFailureOTP({
          title: "Phone Number Exists!",
          message: "A user with this phone number already exists.",
        });
        goBack();
      } else if (status === 404) {
        onFailureOTP({
          title: "User Not Found!",
          message:
            "We couldn't find a user with the provided information. Please double-check and try again.",
        });
        goBack();
      } else if (status >= 500 && status < 600) {
        setAlertTitle("Internal Server Error!");
        setAlertMessage(
          "Oops! Something went wrong on our end. Please try again later or contact support for assistance."
        );
        setAlertVisible(true);
      } else {
        setAlertTitle("Error!");
        setAlertMessage("An error occurred. Please try again later.");
        setAlertVisible(true);
      }
    } else {
      onSuccessOTP(data);
      goBack();
    }
    setLoading(false);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={goBack}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
          <Formik
            initialValues={{
              otp: "",
            }}
            validationSchema={otpSchema}
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
                keyboardShouldPersistTaps="handled"
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
              >
                <SqaureBackButton onPress={goBack} />
                <Image
                  style={styles.imageIcon}
                  source={require("../../assets/icons/user-green-bg.png")}
                />
                <Text style={styles.pageTitleText}>Verify it’s you</Text>
                <Text style={styles.pageSubTitleText}>
                  We have sent a code to{" "}
                  <Text
                    style={{
                      color: colors.secondary,
                      fontFamily: "RobotoMedium",
                    }}
                  >
                    {user.phoneNumber}
                  </Text>
                  .
                </Text>
                <Text style={[styles.pageSubTitleText, { marginTop: 0 }]}>
                  Enter it here to verify your identity.
                </Text>
                <View style={styles.innerFormContainer}>
                  {/* otp Input */}
                  <PasswordInput
                    name="otp"
                    placeHolder="XXXXXX"
                    ref={otpRef}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editable={!loading}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    autoCorrect={false}
                  />
                  <View style={styles.resendContainer}>
                    <TextButton onPress={resendOTP}>Resend Code</TextButton>
                  </View>
                </View>
                <PrimaryButton onPress={handleSubmit}>Submit</PrimaryButton>
              </ScrollView>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </View>
      <AlertBox
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        setVisible={setAlertVisible}
      />
      <LoadingOverlay loading={loading} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: 8,
  },
  innerContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  imageIcon: { marginTop: 22, height: 77, width: 120 },
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
  resendContainer: {
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
