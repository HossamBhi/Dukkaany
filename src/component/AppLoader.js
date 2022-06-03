import React from "react";
import { View, ActivityIndicator } from "react-native";
// import LottieView from "lottie-react-native";
import { bg_color, primary_color_light } from "../assets/utils/color";

export default () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bg_color,
    }}
  >
    {/* <LottieView
      source={require("../assets/lottie/shopping-cart.json")}
      autoPlay
      style={{ width: "90%" }}
      loop
    /> */}
    <ActivityIndicator size={70} animating color={primary_color_light} />
  </View>
);
