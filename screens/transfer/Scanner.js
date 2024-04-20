import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import {
  TextButton,
  SqaureBackButton,
} from "../../components/buttons/index.js";
import { LoadingOverlay, AlertBox } from "../../components/popups/index.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { detailsAPI } from "../../apis/securedAPIs.js";
import AppContext from "../../context/AppContext.js";
import colors from "../../global/colors.js";

const { width } = Dimensions.get("window");

export default function Scanner({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  const [scan, setScan] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AppContext);

  const navigateBack = () => {
    navigation.goBack();
  };

  if (!permission?.granted) {
    requestPermission();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionTextContainer}>
          <SqaureBackButton onPress={navigateBack} />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.permissionText}>
              Grant access to the camera to enable the scanner feature.
            </Text>
            <TextButton onPress={requestPermission} fontFamily={"RobotoItalic"}>
              Grant
            </TextButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const navigateToTransferAmount = (details) => {
    navigation.navigate("TransferAmount", { details });
  };

  const onBarcodeScanned = async (code) => {
    if (!scan || alertVisible) return;
    const phoneNumber = code.data;
    if (!/^[0-9]+$/.test(phoneNumber) || phoneNumber.length !== 10) return;
    setScan(false);
    setLoading(true);
    if (user.phoneNumber == phoneNumber) {
      setAlertTitle("Self!");
      setAlertMessage("Cannot pay to self.");
      setAlertVisible(true);
    } else {
      const { status, data, error } = await detailsAPI({ phoneNumber });
      if (error) {
        if (status === 404) {
          setAlertTitle("Not registered!");
          setAlertMessage("Contact not registered on ScanNpay.");
          setAlertVisible(true);
        } else {
          setAlertTitle("Error!");
          setAlertMessage("An error occurred. Please try again later.");
          setAlertVisible(true);
        }
      } else {
        navigateToTransferAmount(data);
      }
    }
    setLoading(false);
    setScan(true);
  };

  return (
    <SafeAreaView style={styles.safeCameraContainer}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      >
        <View style={styles.innerContainer}>
          <SqaureBackButton onPress={navigateBack} />
          <Text style={styles.pageTitleText}>Scan QR code</Text>
          <Image
            style={styles.qrBound}
            source={require("../../assets/icons/qr-bound.png")}
          />
        </View>
        <AlertBox
          title={alertTitle}
          message={alertMessage}
          visible={alertVisible}
          setVisible={setAlertVisible}
        />
        <LoadingOverlay loading={loading} />
      </CameraView>
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
  permissionTextContainer: {
    paddingHorizontal: 24,
    flex: 1,
  },
  permissionText: {
    fontFamily: "RobotoItalic",
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginVertical: 24,
  },

  safeCameraContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    flex: 1,
  },
  pageTitleText: {
    marginTop: 22,
    color: colors.white,
    fontSize: 24,
    fontFamily: "RobotoBold",
    marginLeft: "auto",
    marginRight: "auto",
  },
  qrBound: {
    height: width * 0.7,
    width: width * 0.7,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 60,
  },
});
