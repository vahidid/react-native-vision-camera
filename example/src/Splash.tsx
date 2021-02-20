import React, { useCallback, useEffect, useState } from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { CONTENT_SPACING, SAFE_AREA_PADDING } from './Constants';

export const Splash: NavigationFunctionComponent = ({ componentId }) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<CameraPermissionStatus>('not-determined');

  const requestMicrophonePermission = useCallback(async () => {
    console.log('Requesting microphone permission...');
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      console.log('Checking Permission status...');
      const [cameraPermission, microphonePermission] = await Promise.all([
        Camera.getCameraPermissionStatus(),
        Camera.getMicrophonePermissionStatus(),
      ]);
      console.log(`Check: CameraPermission: ${cameraPermission} | MicrophonePermission: ${microphonePermission}`);
      setCameraPermissionStatus(cameraPermission);
      setMicrophonePermissionStatus(microphonePermission);
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === 'authorized' && microphonePermissionStatus === 'authorized') {
      Navigation.setRoot({
        root: {
          stack: {
            children: [
              {
                component: {
                  name: 'Home',
                },
              },
            ],
          },
        },
      });
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, componentId]);

  return (
    <View style={styles.container}>
      <Image source={require('../../img/11.png')} style={styles.banner} />
      <Text style={styles.welcome}>Welcome to{'\n'}Vision Camera.</Text>

      <View style={styles.permissionsContainer}>
        {cameraPermissionStatus !== 'authorized' && (
          <Text style={styles.permissionText}>
            Vision Camera needs <Text style={styles.bold}>Camera permission</Text>.
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              Grant
            </Text>
          </Text>
        )}
        {microphonePermissionStatus !== 'authorized' && (
          <Text style={styles.permissionText}>
            Vision Camera needs <Text style={styles.bold}>Microphone permission</Text>.
            <Text style={styles.hyperlink} onPress={requestMicrophonePermission}>
              Grant
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcome: {
    fontSize: 38,
    fontWeight: 'bold',
    maxWidth: '80%',
  },
  banner: {
    position: 'absolute',
    opacity: 0.4,
    bottom: 0,
    left: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...SAFE_AREA_PADDING,
  },
  permissionsContainer: {
    marginTop: CONTENT_SPACING * 2,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});