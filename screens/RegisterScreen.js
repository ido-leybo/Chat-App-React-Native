import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { auth } from "../firebase";
import * as ImagePicker from 'expo-image-picker';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        user
          .updateProfile({
            displayName: name,
            photoURL: selectedImage
              ? selectedImage
              : "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg",
          })
          .then(() => {
            // Update successful
            // ...
          })
          .catch((error) => {});
        navigation.popToTop();
      })
      .catch((error) => {
        let errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);

    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage(pickerResult.uri)
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter your name"
        label="Name"
        leftIcon={{ type: "material", name: "badge" }}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Input
        placeholder="Enter your email"
        label="Email"
        leftIcon={{ type: "material", name: "email" }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        leftIcon={{ type: "material", name: "lock" }}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Input
        type="button"
        label="Profile Picture"
        leftIcon={{ type: "material", name: "face" }}
        value={selectedImage}
        
      />
      <Button title='Pick a photo' style={styles.button} onPress={openImagePickerAsync}/>

      <Button title="register" onPress={register} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});

export default RegisterScreen;
