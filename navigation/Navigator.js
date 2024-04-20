import { useEffect, useContext } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppContext from "../context/AppContext.js";
import AuthNavigator from "./AuthNavigator.js";
import AppNavigator from "./AppNavigator.js";

export default function Navigator() {
  const [fontLoaded] = useFonts({
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    RobotoItalic: require("../assets/fonts/Roboto-Italic.ttf"),
    RobotoLight: require("../assets/fonts/Roboto-Light.ttf"),
    RobotoLightItalic: require("../assets/fonts/Roboto-LightItalic.ttf"),
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
  });

  const { contextLoaded, user } = useContext(AppContext);

  useEffect(() => {
    if (fontLoaded && contextLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, contextLoaded]);

  if (!fontLoaded || !contextLoaded) return null;
  else {
    return user ? <AppNavigator /> : <AuthNavigator />;
  }
}
