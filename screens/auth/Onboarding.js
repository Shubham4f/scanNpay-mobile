import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import OnboardingView from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import colors from "../../global/colors.js";

const { height, width } = Dimensions.get("window");

export default function Onboarding({ navigation }) {
  const signUpButton = ({ ...props }) => (
    <View style={styles.signUpButtonContainer}>
      <TouchableOpacity
        style={styles.signUpButton}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        {...props}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  const navigateToSignUp = () => {
    navigation.replace("SignUp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingView
        containerStyles={styles.onboardingConatiner}
        titleStyles={styles.title}
        subTitleStyles={styles.subTitle}
        onSkip={navigateToSignUp}
        DoneButtonComponent={signUpButton}
        onDone={navigateToSignUp}
        pages={[
          {
            backgroundColor: "#1DAB87",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../../assets/animations/OnboardingAnimation1.json")}
                  autoPlay
                />
              </View>
            ),
            title: "Welcome Aboard",
            subtitle:
              "No more carrying cash!\nStart your payment journey with ease!",
          },
          {
            backgroundColor: "#1DAB87",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../../assets/animations/OnboardingAnimation2.json")}
                  autoPlay
                />
              </View>
            ),
            title: "Swift Payments",
            subtitle: "Say goodbye to queues.\n Hello to instant transactions!",
          },
          {
            backgroundColor: "#1DAB87",
            image: (
              <View>
                <LottieView
                  style={styles.lottie}
                  source={require("../../assets/animations/OnboardingAnimation3.json")}
                  autoPlay
                />
              </View>
            ),
            title: "Start Today!",
            subtitle:
              "Let's make it effortless.\n Your exciting journey starts now.",
          },
        ]}
      />
      <ExpoStatusBar style="light" backgroundColor={colors.primary} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signUpButtonContainer: {
    flex: 0,
    paddingHorizontal: 10,
  },
  signUpButton: {
    flex: 0,
  },
  signUpButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  container: {
    height: height,
    width: width,
    flex: 1,
    backgroundColor: colors.primary,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  onboardingConatiner: {
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "RobotoBold",
  },
  subTitle: {
    fontFamily: "RobotoRegular",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
});
