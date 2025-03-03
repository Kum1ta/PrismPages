import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const	height = Dimensions.get('window').height;

function InProgressPage({setSelectedScan}: any)
{
	let [allProgress, setAllProgress] = React.useState<any>([]);
	const insets = useSafeAreaInsets();

	useEffect(() => {
		listAllProgress().then((data) => {
			if (data)
			{
				const sortedData = data.sort((a: any, b: any) => b.data.time - a.data.time);
				setAllProgress(sortedData);
			}
		});
	}, []);

	return (
		<View style={[styles.body, {paddingTop: insets.top}]}>
			<Text style={styles.titlePage}>Reprendre</Text>
			<ScrollView style={styles.scrollview}>
				{allProgress.map((progress: any) => (
					<React.Fragment key={progress.name}>
						{createButton(progress.data, setSelectedScan, setAllProgress)}
					</React.Fragment>
				))}
			</ScrollView>
		</View>
	);
}

function createButton(data: any, setSelectedScan: Function, setAllProgress: Function)
{
	const	name = data.name;
	const	chapter = data.chapter;
	const	imgUrl = data.imgUrl;
	const	pageUrl = data.pageUrl;

	return (
		<TouchableOpacity
			onPress={() => {
				setSelectedScan([pageUrl, name, imgUrl]);
			}}
			onLongPress={() => {
				Alert.alert('Supprimer', 'Voulez-vous supprimer cette progression ?', [
					{
						text: 'Annuler',
						style: 'cancel',
					},
					{
						text: 'Supprimer',
						onPress: async () => {
							try {
								const validName = name.replace(/[^a-zA-Z0-9]/g, '');
								await AsyncStorage.removeItem(validName);
								const data = await listAllProgress();
								if (data)
								{
									const sortedData = data.sort((a: any, b: any) => b.data.time - a.data.time);
									setAllProgress(sortedData);
								}
							} catch (error) {
								console.log(error);
							}
						},
					},
				]);
			}}
		>
			<View style={styles.line}>
				<Image source={{uri: imgUrl}} style={styles.imageScan}/>
				<View style={styles.lineContent}>
					<Text style={styles.textScan}>
						{name.length > 20 ? name.substring(0, 22) + '...' : name}
					</Text>
					<View style={styles.lineChapContent}>
						<Text style={[styles.textScan, { textAlign: 'center' }]}>CHAP</Text>
						<Text style={[styles.textScan, { textAlign: 'center', marginTop: -5 }]}>{chapter}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const listAllProgress = async () => {
	try {
		const keys = await AsyncStorage.getAllKeys();
		const allProgress = await AsyncStorage.multiGet(keys);
	
		return (allProgress.map(([key, value]: any) => ({
			name: key,
			data: JSON.parse(value),
		})));
	} catch (error) {
		return (null);
	}
};

const styles = StyleSheet.create({
	body: {
		width: '100%',
		height: height - 60,
	},
	titlePage: {
		color: 'white',
		fontSize: 30,
		textAlign: 'center',
		marginTop: 20,
		fontFamily: 'Jersey25-Regular',
	},
	scrollview: {
		width: '100%',
		marginTop: 30,
		flexDirection: 'column',
	},
	line: {
		width: '90%',
		marginInline: 'auto',
		height: 70,
		backgroundColor: '#262626',
		borderRadius: 10,
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	imageScan: {
		width: 60,
		height: 60,
		borderRadius: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	textScan: {
		color: 'white',
		fontSize: 20,
		fontFamily: 'Jersey25-Regular',
	},
	lineContent: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	lineChapContent:{
		marginLeft: 'auto',
		flexDirection: 'column',
		alignItems: 'center',
		marginRight: 10,
	}
});

export default InProgressPage;