import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  Platform,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent app from closing
      }
      return false; // allow default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Button
          title="⬅ Back"
          onPress={() => {
            if (canGoBack) {
              webViewRef?.current?.goBack();
            }
          }}
          disabled={!canGoBack}
        />
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://crm-app-hafid.netlify.app" }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]} // allow all origins
        onShouldStartLoadWithRequest={(request) => {
          // Handle all navigation inside WebView
          if (request.url !== "about:blank") {
            return true; // Allow the navigation
          }
          return false;
        }}
        setSupportMultipleWindows={false} // prevents opening in external browser
      />

      {/* <WebView
        ref={webViewRef}
        source={{ uri: "https://crm-app-hafid.netlify.app" }}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  navBar: {
    height: 50,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
