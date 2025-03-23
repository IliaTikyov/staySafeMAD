import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getUsers } from "../../api/userApi";
import { getContacts } from "../../api/contactApi";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/UI/Button";
import Icon from "react-native-vector-icons/FontAwesome";

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const contactsData = await getContacts();

        const mergedContacts = contactsData.map((contact) => {
          const user = usersData.find(
            (u) => u.UserID === contact.ContactContactID
          );
          return {
            ...contact,
            fullName: user
              ? `${user.UserFirstname} ${user.UserLastname}`
              : "Unknown",
            userImage: user ? user.UserImageURL : null,
            UserUsername: user?.UserUsername || null,
            UserPhone: user?.UserPhone || null,
            // Add any other fields you might need
          };
        });

        setContacts(mergedContacts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Loading contacts...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.ContactID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserView", {
                user: item,
              })
            }
          >
            <View style={styles.contactItem}>
              {item.userImage && (
                <Image
                  source={{ uri: item.userImage }}
                  style={styles.profileImage}
                />
              )}
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{item.fullName}</Text>
                <Text style={styles.contactLabel}>{item.ContactLabel}</Text>
                <Text style={styles.contactDate}>
                  {item.ContactDatecreated}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  plusIcon: {
    color: "white",
    marginRight: 6,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactLabel: {
    fontSize: 14,
    color: "#555",
  },
  contactDate: {
    fontSize: 12,
    color: "#999",
  },
});

export default ContactsScreen;
