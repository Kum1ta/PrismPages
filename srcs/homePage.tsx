import React from 'react';
import {Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { Image } from 'react-native';

const HomePage = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.titleText}>PrismPages</Text>
			<TextInput
				style={styles.searchBar}
				placeholder='Rechercher'
				placeholderTextColor="#989898"
			/>
			<ScrollView style={{width: '100%'}}>
				<View style={styles.results}>
					{newAnime('xZNxkzbKJnxbzKjxbzKxbZKbzNxbZMNbz', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
					{newAnime('Manga', 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630', '')}
				</View>
			</ScrollView>
		</View>
	);
};

function newAnime(name: string, imgUrl: string, pageUrl: string)
{
	return (
		<TouchableOpacity onPress={() => console.log('pressed')} style={styles.scan}>
			<View>
				<Image style={styles.imageScans} source={{uri: imgUrl}}/>
				<Text style={styles.titleScans} numberOfLines={2}>{name}</Text>
			</View>
		</TouchableOpacity>
	);
}


const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		padding: 10,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	titleText: {
		color: 'white',
		marginTop: 5,
		fontSize: 32,
		fontFamily: 'Jersey25-Regular',
	},
	searchBar: {
		width: '95%',
		height: 50,
		borderWidth: 0.5,
		marginTop: 15,
		backgroundColor: '#F6F6F6',
		color: 'black',
		textAlign: 'center',
		fontFamily: 'Jersey25-Regular',
		fontSize: 20
	},
	results: {
		paddingInline: 25,
		paddingTop: 20,
		paddingBottom: 20,
		marginBottom: 65,
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	scan: {
		width: '48%',
		marginBottom: 20,
		flexDirection: 'column',
	},
	imageScans: {
		height: 150,
	},
	titleScans: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		textAlign: 'center',
		margin: 2.5,
		fontSize: 24,
	}
});

export default HomePage;