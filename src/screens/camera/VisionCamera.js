import React from 'react';
import {View, StyleSheet} from 'react-native';
import { useCameraDevice, } from 'react-native-vision-camera';
import { Camera } from 'react-native-vision-camera';
const VisionCamera = () => {
    const device = useCameraDevice('back')

    const codeScanner= {
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
          console.log(`Scanned ${codes.length} codes!`)
        }
      }

  if (device == null) return <NoCameraDeviceError />
  return (
    <Camera
    codeScanner={codeScanner}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}

const styles = StyleSheet.create({})

export default VisionCamera;
