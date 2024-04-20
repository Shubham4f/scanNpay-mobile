import { useContext, useEffect, useLayoutEffect } from "react";
import { Image, Text, StyleSheet } from "react-native";
import AppContext from "../context/AppContext.js";
import { api, setAccessToken } from "../apis/securedAPIs.js";
import { refreshAPI } from "../apis/refreshAPI.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home.js";
import TransactionNavigator from "./TransactionNavigator.js";
import TransferNavigator from "./TransferNavigator.js";
import UserNavigator from "./UserNavigator.js";
import Settings from "../screens/Settings.js";
import colors from "../global/colors.js";

export default function AppNavigator() {
  const { signOutSave } = useContext(AppContext);

  useLayoutEffect(() => {
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401) {
          try {
            const { status, data, error } = await refreshAPI();
            if (!error) {
              setAccessToken(data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return api(originalRequest);
            } else if (status === 401) {
              signOutSave();
            }
          } catch (error) {
            signOutSave();
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, tabBarLabelPosition: "below-icon" }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => homeIcon(focused),
          tabBarLabel: ({ focused }) => lable(focused, "Home"),
        }}
      />
      <Tab.Screen
        name="TransactionNavigator"
        component={TransactionNavigator}
        options={{
          tabBarIcon: ({ focused }) => transactionIcon(focused),
          tabBarLabel: ({ focused }) => lable(focused, "History"),
          unmountOnBlur: true,
        }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Tab.Screen
        name="TransferNavigator"
        component={TransferNavigator}
        options={{
          tabBarIcon: ({ focused }) => transferIcon(focused),
          tabBarLabel: () => "",
          unmountOnBlur: true,
          tabBarStyle: { display: "none" },
        }}
        listeners={({ navigation }) => ({
          blur: () => navigation.setParams({ screen: undefined }),
        })}
      />
      <Tab.Screen
        name="UserNavigator"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ focused }) => userIcon(focused),
          tabBarLabel: ({ focused }) => lable(focused, "Profile"),
        }}
      />

      <Tab.Screen
        name="Settinngs"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => settingsIcon(focused),
          tabBarLabel: ({ focused }) => lable(focused, "Settings"),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  label: {
    fontSize: 10,
    fontFamily: "RobotoMedium",
    color: colors.textLight,
    marginBottom: 5,
  },
  labelActive: {
    fontFamily: "RobotoBold",
    color: colors.secondary,
  },
});

const lable = (focused, title) => {
  if (focused)
    return <Text style={[styles.label, styles.labelActive]}>{title}</Text>;
  else return <Text style={styles.label}>{title}</Text>;
};

const homeIcon = (focused) => {
  if (focused)
    return (
      <Image
        style={styles.icon}
        source={require("../assets/icons/home-filled.png")}
      />
    );
  else
    return (
      <Image style={styles.icon} source={require("../assets/icons/home.png")} />
    );
};

const transactionIcon = (focused) => {
  if (focused)
    return (
      <Image
        style={styles.icon}
        source={require("../assets/icons/history-filled.png")}
      />
    );
  else
    return (
      <Image
        style={styles.icon}
        source={require("../assets/icons/history.png")}
      />
    );
};

const transferIcon = (focused) => {
  return (
    <Image
      style={[styles.icon, { height: 96, width: 96 }]}
      source={require("../assets/icons/scan-green-bg.png")}
    />
  );
};

const userIcon = (focused) => {
  if (focused)
    return (
      <Image
        style={styles.icon}
        source={require("../assets/icons/user-filled.png")}
      />
    );
  else
    return (
      <Image style={styles.icon} source={require("../assets/icons/user.png")} />
    );
};

const settingsIcon = (focused) => {
  if (focused)
    return (
      <Image
        style={[styles.icon, { height: 22, width: 22, marginTop: 2 }]}
        source={require("../assets/icons/settings-filled.png")}
      />
    );
  else
    return (
      <Image
        style={[styles.icon, { height: 22, width: 22, marginTop: 2 }]}
        source={require("../assets/icons/settings.png")}
      />
    );
};
