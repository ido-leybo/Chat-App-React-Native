import React, { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, StyleSheet, Text } from "react-native";
import { Avatar, Image } from "react-native-elements";
import { auth } from "../firebase";

const ProfileImage = ({ navigation }) => {
  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => <Text>Profile image</Text>,
  //     });
  //   }, []);
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: auth?.currentUser?.photoURL,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width: 350,
    height: 550,
    marginTop: "15%",
  },
});

export default ProfileImage;
