import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { View, Text } from "react-native";
import { auth, db } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapShot) =>
        setMessages(
          snapShot.docs.map((doc) => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            sent: true,
            received: true,
          }))
        )
      );
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    db.collection("chats").add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={{
            marginLeft: 20,
          }}
        >
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 30,
          }}
          onPress={signOut}
        >
          <AntDesign name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL,
      }}
      renderUsernameOnMessage={true}
      alwaysShowSend={true}
      onLongPress={(context, message) => {
        if (message.text) {
          const options = ["Copy text", "Delete message", "Cancel"];
          const cancelButtonIndex = options.length - 1;
          context.actionSheet().showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex,
            },
            (buttonIndex) => {
              switch (buttonIndex) {
                case 0:
                  Clipboard.setString(message.text);
                  break;
                case 1:
                  db.collection("chats")
                    .where("_id", "==", message._id)
                    .get()
                    .then(function (querySnapshot) {
                      querySnapshot.forEach(function (doc) {
                        db.collection("chats")
                          .doc(doc.id)
                          .delete()
                          .then(() => {
                            console.log("Document successfully deleted!");
                          })
                          .catch((error) => {
                            console.error("Error removing document: ", error);
                          });
                      });
                    })
                    .catch(function (error) {
                      console.log("Error getting documents: ", error);
                    });
                default:
                  console.log("not matched");
                  break;
              }
            }
          );
        }
      }}
    />
  );
};

export default ChatScreen;
