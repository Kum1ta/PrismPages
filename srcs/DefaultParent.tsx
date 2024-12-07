import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import HomePage from './HomePage';
import ScanPage from './ScanPage';
import ReadingPage from './ReadingPage';
import InProgressPage from './InProgressPage';
import SettingsPage from './SettingsPage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DefaultParent = () =>
{
	const	[buttonSelectedId, setButtonSelectedId] = useState(1);
	const	[selectedScan, setSelectedScan] = useState(null);
	const	[reading, setReading] = useState({bool: false, scan: null, chapter: 1});
	const	page = [<InProgressPage setSelectedScan={setSelectedScan}/>, <HomePage setSelectedScan={setSelectedScan}/>, <SettingsPage />];
	const	insets = useSafeAreaInsets();

	if (reading.bool)
		return (<ReadingPage reading={reading} setReading={setReading} selectedScan={selectedScan}/>);
	if (selectedScan)
	{
		return (<ScanPage
					scan={selectedScan}
					setSelectedScan={setSelectedScan}
					setReading={setReading}
		/>);
	}
	return (
		<View style={styles.body}>
			<View style={styles.content}>
				{page[buttonSelectedId]}
			</View>
			<View style={styles.container}>
				{createButton(() => setButtonSelectedId(0), require('../assets/icons/reading.png'), 0, buttonSelectedId)}
				{createButton(() => setButtonSelectedId(1), require('../assets/icons/home.png'), 1, buttonSelectedId)}
				{createButton(() => setButtonSelectedId(2), require('../assets/icons/settings.png'), 2, buttonSelectedId)}
			</View>
		</View>
	);
}

function createButton(func: Function, imgUrl: number, id: number, buttonSelectedId: number)
{
	let	buttonStyle;

	if (id === buttonSelectedId)
		buttonStyle = styles.selectedButton;
	else
		buttonStyle = styles.button
	return (
		<TouchableOpacity onPress={() => func()}>
			<Image style={buttonStyle} source={imgUrl}/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		backgroundColor: '#2A2D34',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	content: {
		width: '100%',
	},
	container: {
		backgroundColor: '#262626',
		height: 60,
		width: '100%',
		marginTop: 'auto',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingInline: 40,
	},
	button: {
		height: 30,
		width: 30,
		tintColor: 'gray'
	},
	selectedButton: {
		height: 35,
		width: 35,
		tintColor: 'white'
	},
});

export default DefaultParent;