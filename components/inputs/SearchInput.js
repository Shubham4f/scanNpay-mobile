import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../global/colors.js";

export default function SearchInput({ name, values, handleChange, search }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          focused ? styles.inputContainerFocused : "",
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={colors.secondary}
          style={{ paddingRight: 2 }}
        />
        <TextInput
          placeholderTextColor={colors.placeHolder}
          cursorColor={colors.secondary}
          style={styles.input}
          placeholder="Search"
          autoComplete="tel"
          returnKeyType="search"
          onChangeText={(event) => {
            handleChange(name)(event);
            search(event);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          value={values[name]}
          onFocus={() => setFocused(true)}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    height: 56,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainerFocused: {
    borderWidth: 1,
    borderBlockColor: colors.balck,
    padding: 15,
  },
  input: {
    fontFamily: "RobotoMedium",
    color: colors.secondary,
    fontSize: 16,
    flex: 1,
  },
});
