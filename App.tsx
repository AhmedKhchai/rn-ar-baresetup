import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  NativeModules,
} from 'react-native';

function App() {
  const openARViewer = () => {
    const fileUrl =
      'https://modelviewer.dev/shared-assets/models/Astronaut.glb'; // Replace with your actual 3D model URL
    const title = 'Astronaut'; // Replace with your actual title
    NativeModules.ARModule.openViewer(fileUrl, title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Button title="Open AR Viewer" onPress={openARViewer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
