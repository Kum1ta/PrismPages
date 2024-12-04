import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import HomePage from './HomePage';
import ScanPage from './ScanPage';
import ReadingPage from './ReadingPage';


const DefaultParent = () =>
{
	const	[buttonSelectedId, setButtonSelectedId] = useState(1);
	const	[selectedScan, setSelectedScan] = useState(null);
	const	[reading, setReading] = useState({bool: false, scan: null, chapter: 1});
	const	page = [null, <HomePage setSelectedScan={setSelectedScan}/>, null];

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
				{createButton(() => setButtonSelectedId(0), require('../assets/icons/home.png'), 0, buttonSelectedId)}
				{createButton(() => setButtonSelectedId(1), require('../assets/icons/home.png'), 1, buttonSelectedId)}
				{createButton(() => setButtonSelectedId(2), require('../assets/icons/home.png'), 2, buttonSelectedId)}
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
		height: 75,
		width: '100%',
		marginTop: 'auto',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingInline: 40,
	},
	button: {
		height: 55,
		width: 55,
		tintColor: 'gray'
	},
	selectedButton: {
		height: 58,
		width: 58,
		tintColor: 'white'
	},
});

export {DefaultParent};