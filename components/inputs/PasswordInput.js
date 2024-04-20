import { useState, forwardRef } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import colors from "../../global/colors.js";
import { Feather } from "@expo/vector-icons";

export default TextInputLarge = forwardRef(function (
  {
    name,
    placeHolder,
    nextRef,
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    editable,
    keyboardType,
    returnKeyType,
    autoCapitalize,
    autoComplete,
    autoCorrect,
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          focused ? styles.inputContainerFocused : "",
        ]}
      >
        <TextInput
          placeholderTextColor={colors.placeHolder}
          cursorColor={colors.secondary}
          style={styles.input}
          placeholder={placeHolder}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={!visible}
          autoCorrect={autoCorrect}
          ref={ref}
          onSubmitEditing={() => {
            if (nextRef) nextRef.current.focus();
          }}
          onChangeText={handleChange(name)}
          onBlur={(event) => {
            setFocused(false);
            handleBlur(name)(event);
          }}
          value={values[name]}
          onFocus={() => setFocused(true)}
        />
        <Pressable
          onPress={() => setVisible((prev) => !prev)}
          style={styles.eyeContainer}
        >
          {visible ? (
            <Feather name="eye" size={20} color={colors.textLight} />
          ) : (
            <Feather name="eye-off" size={20} color={colors.textLight} />
          )}
        </Pressable>
      </View>
      {touched[name] && errors[name] && (
        <Text style={styles.inputError}>{errors[name]}</Text>
      )}
    </View>
  );
});
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
  inputError: {
    fontFamily: "RobotoItalic",
    fontSize: 12,
    color: colors.danger,
    marginLeft: 8,
    marginTop: 8,
  },
  eyeContainer: {
    marginLeft: 4,
  },
});
