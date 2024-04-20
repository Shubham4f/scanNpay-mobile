import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import AppContextProvider from "./context/AppContextProvider.js";
import Navigator from "./navigation/Navigator.js";
import { NoInternetOverlay } from "./components/popups/index.js";
import colors from "./global/colors.js";

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
      <NoInternetOverlay />
      <ExpoStatusBar style="light" backgroundColor={colors.primary} />
    </AppContextProvider>
  );
}
