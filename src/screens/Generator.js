import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, RefreshControl, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { QRCode } from '../utils/constants';
import * as Updates from "expo-updates";

//Refresh
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

export default function App() {
  const [qr, setQr] = React.useState('TruperMax');
  const [refreshing, setRefreshing] = useState(false);
  
  //Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    Updates.reloadAsync();
  }, []);

  const downloadFile = async () => {
    try {
      let fielUri = FileSystem.documentDirectory + 'qrcode.png';
      const {uri} = await FileSystem.downloadAsync(`${QRCode}${qr}`, fielUri);

      saveFile(uri);
    }catch (error) {
      console.log(error);
    }
  }
  const alert = () =>
    Alert.alert(
      "Finalizado...",
      "Se guardo correctamente el Codigo QR.",
      [
        { text: "OK"}
      ]
  );

  const saveFile = async (fielUri) => {
    const {status} = await MediaLibrary.requestPermissionsAsync();

    if(status === 'granted'){
      const asset = await MediaLibrary.saveToLibraryAsync(fielUri);
    }
    alert();
  }

  const handelDownload = () => {
    downloadFile();
  }

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
        <View style={styles.qrCodeRow}>
          <Text style={styles.titleOne}>QR Code</Text>
          <Text style={styles.titleTwo}>Generator</Text>
        </View>

        <TextInput
          style = {styles.input}
          placeholder = 'Ingrese algun texto/url'
          placeholderTextColor="#969696"
          onChange = {(e) => setQr(e.nativeEvent.text)}
        />

        {qr && 
          <>
            <Image 
              style={styles.image}
              source={{ uri: `${QRCode}${qr}` }}
            />
            <TouchableOpacity 
              style = {styles.button}
              activeOpacity={0.7}
              onPress={() => handelDownload()}
            > 
              <Text style={styles.text}>Descargar</Text>
            </TouchableOpacity>
          </>
        }
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  qrCodeRow:{
    height: 45,
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 54,
    marginRight: 54,
    alignSelf: 'center',
  },
  titleOne: {
    fontWeight: 'bold',
    fontSize: 35,
    color: 'rgb(55,55,55)',
  },
  titleTwo: {
    color: "#FF7D54",
    fontSize: 35,
    marginLeft: 7,
    fontWeight: 'bold',
  },
  input: {
    marginTop: 40,
    textAlign: 'center',
    height: 50,
    color: 'gray',
    width: '80%',
    marginBottom: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#1e3040',
    alignSelf: 'center',
  },
  image:{
    width: 255,
    height: 255,
    marginTop: 10,
    alignSelf: 'center',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#FF7D54',
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});