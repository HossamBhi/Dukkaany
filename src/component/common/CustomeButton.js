import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { primary_color } from "../../utils/color";

export default ({ onPress, style, textStyle, text, disabled, icon }) => (
  <TouchableOpacity
    disabled={disabled ? true : false}
    style={[styles.btn, style, disabled && { opacity: 0.5 }]}
    onPress={onPress}
  >
    {icon && icon}
    {text && <Text style={[styles.btnText, textStyle]}>{text}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
    backgroundColor: primary_color,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "700",
    paddingHorizontal: 18,
  },
});
