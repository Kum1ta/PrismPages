import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Button, Touchable, TouchableOpacity, Image, Alert} from "react-native";
import RNFS from 'react-native-fs';

function SettingsPage()
{
	const	[cacheSize, setCacheSize] = useState(0);

	useEffect(() => {
		getCacheSize(setCacheSize);
	}, [cacheSize]);
	return (
		<View style={styles.body}>
			<Text style={styles.titlePage}>Paramètres</Text>
			<Text style={styles.h1}>Global</Text>
			<View style={styles.line}>
				<Text style={styles.h1}>Cache</Text>
				<View style={styles.rightLine}>
					<Text style={[styles.h1, {marginRight: 10}]}>{cacheSize}MB</Text>
					<TouchableOpacity
						style={{backgroundColor: '#171717', padding: 5, borderRadius: 10}}
						onPress={() => deleteCache(setCacheSize)}
					>
						<Image source={require('../assets/icons/trash.png')} style={{width: 25, height: 25}}/>
					</TouchableOpacity>				
				</View>
			</View>
		</View>
	)
}

function deleteCache(setCacheSize: Function)
{
	Alert.alert("Cache", "Voulez-vous vraiment supprimer le cache ?", [
		{
			text: "Annuler",
			style: "cancel"
		},
		{
			text: "Supprimer",
			onPress: () => {
				RNFS.readDir(RNFS.CachesDirectoryPath).then((result) => {
					for (let i = 0; i < result.length; i++)
					{
						RNFS.unlink(result[i].path);
					}
					getCacheSize(setCacheSize);
				});
			}
		}
	]);
}

function getCacheSize(setCacheSize: Function)
{
	RNFS.readDir(RNFS.CachesDirectoryPath).then((result) => {
		let size = 0;
		for (let i = 0; i < result.length; i++)
			size += result[i].size;
		setCacheSize((size / (1024 * 1024)).toFixed(1));
	});
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
	},
	titlePage: {
		color: 'white',
		fontSize: 30,
		marginBlock: 20,
		height: 50,
		textAlign: 'center',
		fontFamily: 'Jersey25-Regular',
	},
	h1: {
		color: 'white',
		fontSize: 26,
		marginLeft: 20,
		fontFamily: 'Jersey25-Regular',
	},
	line: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		marginInline: 15,
		height: 50,
		alignItems: 'center',
	},
	rightLine: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginRight: 20,
	},
});

export default SettingsPage;