import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default ({ message, image, imageStyle, btn }) => (
  <View style={styles.container}>
    {image && (
      <Image
        source={image}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />
    )}
    <Text style={styles.text}>{message}</Text>
    {btn}
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  image: {
    width: "70%",
    minWidth: 150,
    minHeight: 200,
    height: "40%",
  },
  text: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 20,
  },
});
