import { useState, useEffect, useRef, useContext } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  PrimaryButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import {
  WithdrawInput,
  TextInputLarge,
} from "../../components/inputs/index.js";
import { LoadingOverlay } from "../../components/popups/index.js";
import Avatar from "../../components/Avatar.js";
import { balanceAPI } from "../../apis/securedAPIs.js";
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
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";

export default function WithdrawAmount({ navigation, route }) {
  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState(0);

  const { user } = useContext(AppContext);

  const beneficiaryRef = useRef(null);
  const accountNumberRef = useRef(null);
  const ifscRef = useRef(null);
  const amountRef = useRef(null);

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
      beneficiary: yup
        .string()
        .required("Beneficiary name is required")
        .min(3, "Beneficiary name must be at least 3 characters")
        .max(40, "Beneficiary name must be at most 20 characters")
        .matches(/^[a-zA-Z ]+$/, "Beneficiary name can only contain letters"),
      accountNumber: yup
        .string()
        .matches(
          /^[0-9]{9,18}$/,
          "Account number must be between 9 and 18 digits"
        )
        .required("Account number is required."),
      ifsc: yup
        .string()
        .matches(
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "IFSC code must be in the format: 4 letters, 0, 6 alphanumeric characters"
        )
        .required("IFSC code is required."),
    });
  } else if (balance === 0) {
    var amountSchema = yup.object({
      amount: yup
        .number()
        .required("Amount is required")
        .min(1, "Amount must be greater than or equal to ₹1")
        .max(0, "Your account balance is currently at ₹0"),
      beneficiary: yup
        .string()
        .required("Beneficiary name is required")
        .min(3, "Beneficiary name must be at least 3 characters")
        .max(40, "Beneficiary name must be at most 20 characters")
        .matches(/^[a-zA-Z ]+$/, "Beneficiary name can only contain letters"),
      accountNumber: yup
        .string()
        .matches(
          /^[0-9]{9,18}$/,
          "Account number must be between 9 and 18 digits"
        )
        .required("Account number is required"),
      ifsc: yup
        .string()
        .matches(
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "IFSC code must be in the format: 4 letters, 0, 6 alphanumeric characters"
        )
        .required("IFSC code is required"),
    });
  } else {
    var amountSchema = yup.object({
      amount: yup
        .number()
        .required("Amount is required")
        .min(1, "Amount must be greater than or equal to ₹1")
        .max(10000, "Amount must be less than or equal to 10,000"),
      beneficiary: yup
        .string()
        .required("Beneficiary name is required")
        .min(3, "Beneficiary name must be at least 3 characters")
        .max(40, "Beneficiary name must be at most 20 characters")
        .matches(/^[a-zA-Z ]+$/, "Beneficiary name can only contain letters"),
      accountNumber: yup
        .string()
        .matches(
          /^[0-9]{9,18}$/,
          "Account number must be between 9 and 18 digits"
        )
        .required("Account number is required"),
      ifsc: yup
        .string()
        .matches(
          /^[A-Z]{4}0[A-Z0-9]{6}$/,
          "IFSC code must be in the format: 4 letters, 0, 6 alphanumeric characters"
        )
        .required("IFSC code is required"),
    });
  }
  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToTransferPin = (values) => {
    navigation.navigate("TransferPin", {
      details: values,
    });
  };
  const onSubmit = (values) => {
    navigateToTransferPin(values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <Formik
          initialValues={{
            beneficiary: "",
            accountNumber: "",
            ifsc: "",
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
                <Text style={styles.pageTitleText}>Withdraw Money</Text>
                <View style={styles.avatar}>
                  <Avatar
                    display="W"
                    phoneNumber={user.phoneNumber}
                    size={64}
                  />
                </View>
                <View style={styles.innerFormContainer}>
                  {/* Beneficiary Input */}
                  <TextInputLarge
                    name="beneficiary"
                    placeHolder="Beneficiary Name"
                    ref={beneficiaryRef}
                    nextRef={accountNumberRef}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editable={true}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoComplete="given-name"
                    autoCorrect={false}
                  />
                  {/* Account Number Input */}
                  <TextInputLarge
                    name="accountNumber"
                    placeHolder="Account Number"
                    ref={accountNumberRef}
                    nextRef={ifscRef}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editable={true}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {/* ifsc Input */}
                  <TextInputLarge
                    name="ifsc"
                    placeHolder="IFSC Code"
                    ref={ifscRef}
                    nextRef={amountRef}
                    values={values}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    editable={true}
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                  {/* Amount Input */}
                  <WithdrawInput
                    name="amount"
                    ref={amountRef}
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
