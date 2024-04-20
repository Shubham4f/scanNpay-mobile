import { useState, useEffect } from "react";
import AppContext from "./AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";
import { setRefreshToken, setAccessToken } from "../apis/securedAPIs.js";

export default function AppContextProvider({ children }) {
  const [contextLoaded, setContextLoaded] = useState(false);
  const [user, setUser] = useState(null);

  const setFromStorage = async () => {
    const refreshToken = getItem("refreshToken");
    const storageUser = await AsyncStorage.getItem("user");
    if (refreshToken && storageUser) {
      setRefreshToken(refreshToken);
      setUser(JSON.parse(storageUser));
    }
    setContextLoaded(true);
  };

  useEffect(() => {
    setFromStorage();
  }, []);

  const signInSave = async ({
    phoneNumber,
    firstName,
    lastName,
    merchant,
    refreshToken,
    accessToken,
  }) => {
    setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem(
      "user",
      JSON.stringify({ phoneNumber, firstName, lastName, merchant })
    );
    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
    setUser({ phoneNumber, firstName, lastName, merchant });
  };

  const signOutSave = async () => {
    await deleteItemAsync("refreshToken");
    await AsyncStorage.removeItem("user");
    setUser(null);
    setRefreshToken(null);
    setAccessToken(null);
  };

  return (
    <AppContext.Provider
      value={{ contextLoaded, user, signInSave, signOutSave }}
    >
      {children}
    </AppContext.Provider>
  );
}
