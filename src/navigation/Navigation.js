import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image } from 'react-native';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Scanner from '../screens/Scanner';
import Generator from '../screens/Generator';

//const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

export default function Navigation(){
	return(
		<>
		<StatusBar barStyle="dark-content" />
		<Drawer.Navigator
			drawerContent = {(props) => <MenuItems { ...props } />}
		>
	    	<Drawer.Screen
		        name="Home"
		        component={Generator}
		        options={{ title: 'Crear' }}
	      	/>
			<Drawer.Screen
		    	name="Scan"
		        component={Scanner}
		        options={{ title: 'Escanear' }}
		    />
	    </Drawer.Navigator>
	    </>
	);
}

const MenuItems = ({navigation}) => {
	return (
		<DrawerContentScrollView style={styles.container}>
			<Text style = {styles.title}>Menú</Text>

			<TouchableOpacity
				style={styles.button}
				onPress = {() => navigation.navigate('Home')}
			>
				<Image
					style={styles.icon} 
					source= {require('../../assets/crear.png')} 
				/>
				<Text style={styles.textButton}>Crear</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button} 
				onPress = {() => navigation.navigate('Scan')}
			>
				<Image
					style={styles.icon} 
					source= {require('../../assets/scan.png')} 
				/>
				<Text style={styles.textButton}>Escanear</Text>
			</TouchableOpacity>

			<Text style = {{color: 'gray', textAlign: 'center'}}>V 1.0.0</Text>
		</DrawerContentScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
	},
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#373737',
    },
    button: {
    	alignItems: 'center',
	    backgroundColor: '#FFF',
	    borderRadius: 10,
	    flexDirection: 'row',
	    marginBottom: 15,
	    padding: 5,
	    borderWidth: 1,
	  	borderColor: '#FF7D54',
  },
  icon: {
  	width: 40,
  	height: 40,
  	borderRadius: 10,
  },
  textButton: {
  	color: '#FF7D54',
  	fontWeight: 'bold',
  	marginStart: 15,
  },
});