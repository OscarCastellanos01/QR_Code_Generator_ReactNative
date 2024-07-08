import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Linking, Button, Alert, RefreshControl, ScrollView, Image} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import * as Updates from "expo-updates";
import { QRCode } from '../utils/constants';

//Refresh
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function Scanner() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [qr, setQr] = React.useState('');
  const [refreshing, setRefreshing] = useState(false);

  //Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    Updates.reloadAsync();
  }, []);

  //Scanner
  const askForCameraPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    setQr(data);
    //console.log('Type: ' + type + '\nData: ' + data);
  };

  //Open URL
  const OpenURLButton = ({ url, children }) => {

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`No sé cómo abrir esta URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} color= '#FF7D54'/>;
};

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No acces to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermissions()} color= '#FF7D54'/>
      </View>
    )
  }

  //Clipboard
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
      {!scanned ?
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      : 
        <>
          <Image 
            style={styles.image}
            source={{ uri: `${QRCode}${qr}` }}
          />
          <Text style={styles.maintext}>{text}</Text>
        </>
      }

        {scanned && 
          <>
            <View style={styles.opciones}>
              <View style={styles.btn1}>
                <OpenURLButton url={text}>Abrir url</OpenURLButton>
              </View>
              <View style={styles.btn2}>
                <Button title="Copiar" onPress={copyToClipboard} color= '#FF7D54'/>
              </View>
            </View>

            <Button 
              title={'Volver a escanear'} 
              onPress={() => setScanned(false)}
              color= '#FF7D54'
            />
          </>
        }

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    alignSelf: 'center',
  },
  opciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  btn1: {
    marginRight: 5,
  },
  btn2: {
    marginLeft: 5,
  },
  image:{
    width: 255,
    height: 255,
    marginTop: 10,
    alignSelf: 'center',
  },
});