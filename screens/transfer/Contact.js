import { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Text,
  FlatList,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import * as Contacts from "expo-contacts";
import { Formik } from "formik";
import { SqaureBackButton } from "../../components/buttons/index.js";
import { SearchInput } from "../../components/inputs/index.js";
import { ContactListItem } from "../../components/index.js";
import { detailsAPI } from "../../apis/securedAPIs.js";
import AppContext from "../../context/AppContext.js";
import colors from "../../global/colors.js";

const { height } = Dimensions.get("window");

export default function Contact({ navigation }) {
  const [allContacts, setAllContacts] = useState([]);
  const [fillteredContacts, setFillteredContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [permission, setPermission] = useState(false);

  const { user } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setPermission(true);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const validData = data.filter(
            (element) => element.phoneNumbers !== undefined
          );
          setAllContacts(validData);
          setFillteredContacts(validData);
        }
      }
      setContactsLoading(false);
    })();
  }, []);

  const contactSerach = async (term) => {
    if (term.length === 0) return setFillteredContacts(allContacts);
    term = term.toLowerCase();
    const results = allContacts.filter(
      (element) =>
        element.name.toLowerCase().includes(term) ||
        element.phoneNumbers[0]?.number.replace(/[\s-]+/g, "").includes(term)
    );
    setFillteredContacts(results);

    if (term.length >= 10 && term.length <= 14 && results.length === 0) {
      setContactsLoading(true);
      const clean = term.replace(/[\s-]+/g, "").slice(-10);
      const isNumber = /^[0-9]+$/.test(clean);
      if (isNumber && user.phoneNumber !== clean) {
        const { status, data, error } = await detailsAPI({
          phoneNumber: clean,
        });
        if (!error) setFillteredContacts([data]);
      }
      setContactsLoading(false);
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.fixedContainer}
          >
            <SqaureBackButton onPress={navigateBack} />
            <Text style={styles.serachPrompt}>
              Enter scanNpay number or search contact name
            </Text>
            <Formik
              initialValues={{
                search: "",
              }}
            >
              {({ values, handleChange }) => (
                <SearchInput
                  name="search"
                  values={values}
                  handleChange={handleChange}
                  search={contactSerach}
                />
              )}
            </Formik>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <FlatList
          ListHeaderComponent={() => (
            <ListHeaderComponent
              allContacts={allContacts}
              fillteredContacts={fillteredContacts}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmptyComponent
              contactsLoading={contactsLoading}
              permission={permission}
            />
          )}
          data={fillteredContacts}
          renderItem={({ item }) => <ContactListItem contact={item} />}
          keyExtractor={(item) => item.id || item.receiver_id}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContainer]}
          ListFooterComponent={() => (
            <ListFooterComponent
              contactsLoading={contactsLoading}
              fillteredContacts={fillteredContacts}
            />
          )}
        />
      </View>
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
    paddingHorizontal: 24,
    flex: 1,
  },
  fixedContainer: {
    paddingBottom: 10,
  },
  serachPrompt: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: "RobotoRegular",
    color: colors.textLight,
  },
  listContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.lightBackground,
  },
  listHeadingContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listHeading: {
    fontFamily: "RobotoMedium",
    fontSize: 14,
    color: colors.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
  },
});

function ListHeaderComponent({ allContacts, fillteredContacts }) {
  return (
    <View style={styles.listHeadingContainer}>
      <Text style={styles.listHeading}>
        {allContacts.length === fillteredContacts.length
          ? "All contacts"
          : "Results"}
      </Text>
    </View>
  );
}

const ListEmptyComponent = ({ contactsLoading, permission }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {contactsLoading ? (
        <ActivityIndicator color={colors.secondary} size="large" />
      ) : (
        <Text style={[styles.listHeading, { fontFamily: "RobotoItalic" }]}>
          {permission
            ? "No contact found."
            : "Grant permission to access your contacts."}
        </Text>
      )}
    </View>
  );
};

const ListFooterComponent = ({ contactsLoading, fillteredContacts }) => {
  if (contactsLoading) return null;
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={[styles.listHeading, { fontFamily: "RobotoItalic" }]}>
        {fillteredContacts.length === 0 ? "" : " No more contacts."}
      </Text>
    </View>
  );
};

function Separator() {
  return <View style={styles.separator}></View>;
}
