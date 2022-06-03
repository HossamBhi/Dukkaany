import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log("Authorization status:", authStatus);
  }
}
const FCM_TOKEN_KEY = "Bisha:FCMToken";

export async function getFCMToken() {
  let FCMToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

  if (!FCMToken) {
    try {
      FCMToken = await messaging().getToken();
      if (FCMToken) {
        console.log("New Token: ", FCMToken);
        await AsyncStorage.setItem(FCM_TOKEN_KEY, FCMToken);
      }
    } catch (e) {
    //   console.log("error: ", e);
    }
  } else {
    // console.log("Old Token: ", FCMToken);
  }
}
getFCMToken();

export const notificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp((remoteMessage) => {
    // console.log(
    //   "Notification caused app to open from background state:",
    //   remoteMessage.notification
    // );
    // navigation.navigate(remoteMessage.data.type);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        // console.log(
        //   "Notification caused app to open from quit state:",
        //   remoteMessage.notification
        // );
      }
    });

  messaging().onMessage(async (remoteMessage) => {
    // console.log("notification on Forground message state: ", remoteMessage);
  });
};
