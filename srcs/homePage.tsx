import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BottomBar from './bottomBar';

const HomePage = () => {
	return (
		<View
			style={styles.container}>
			<Text>Hello, world!</Text>
			<BottomBar />
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default HomePage;