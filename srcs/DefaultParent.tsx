import React, {useState} from 'react';
import {Text, View, StyleSheet, Image, Touchable, TouchableOpacity} from 'react-native';
import HomePage from './homePage';

const DefaultParent = () =>
{
	const	[buttonSelectedId, setButtonSelectedId] = useState(1);
	const	page = [null, <HomePage/>, null]

	return (
		<View style={styles.body}>
			{page[buttonSelectedId]}
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
	},
	container: {
		// position: 'absolute',
		// bottom: 0,
		marginTop: 'auto',
		marginBottom: 0,
		backgroundColor: '#262626',
		height: 75,
		width: '100%',
		shadowColor: 'black',
		shadowOffset: {width: 0, height: 10},
		shadowOpacity: 0.8,
		shadowRadius: 10,
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
	}
});

export default DefaultParent;