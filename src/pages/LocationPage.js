import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import CustomeButton from "../component/common/CustomeButton";
import { _MARKZ_BADR_EREA } from "../utils/database";
import * as Location from "expo-location";
import MessageView from "../component/common/MessageView";
import { setLocationStorage } from "../utils/storage";

export default ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("جاري التحميل...");
  const [LP, setLP] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLP(false);
        setErrorMsg("تم رفض إذن الوصول إلى الموقع.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLP(true);
      setErrorMsg("جاري التحميل...");
      // console.log("Location: ", location);
      const revLocation = await Location.reverseGeocodeAsync(location.coords);
      // console.log("revLocation: ", revLocation[0]);
      // const { region } = revLocation[0];
      // console.log("region: ", region?.includes("Beheira"));
      // console.log(
      //   "is inArea: ",
      //   arePointsNear(location.coords, _MARKZ_BADR_EREA, _MARKZ_BADR_EREA.area)
      // );
      setLocationStorage(revLocation);
      navigation.navigate("BrowserPage");
    })();
  }, []);

  if (LP === false) {
    return (
      <MessageView
        message={errorMsg}
        btn={
          <CustomeButton
            text={"افتح الضبط"}
            onPress={() => Linking.openSettings()}
            style={{ marginTop: 40 }}
          />
        }
      />
    );
  }
  // if (LP === null || location === null) {
  return (
    <MessageView message={errorMsg} image={require("../assets/loading.png")} />
  );
  // }

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{JSON.stringify(location)}</Text>
    </View>
  );

  // return (
  //   <View style={{ flex: 1, backgroundColor: bg_color }}>
  //     <FlatList data={PLACES} />
  //     <CustomeButton text="Done" style={{}} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
