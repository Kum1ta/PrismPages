import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { Image } from 'react-native';
import { parseDocument } from 'htmlparser2';
import { selectAll, selectOne } from 'css-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const height = Dimensions.get('window').height;

const urlAnimeSama = 'https://anime-sama.fr/catalogue/?type%5B0%5D=Scans&search=&page=';

let animeList: any = null;
let interval: any = null;

const HomePage = ({setSelectedScan}: any) => {
	const [animes, setAnimes] = useState<any>([]);
	const insets = useSafeAreaInsets();

	React.useEffect(() => {
		if (animeList)
		{
			setAnimes(animeList);
			return;
		}
		fetchAnimeSama().then((data) => {
			animeList = data;
			setAnimes(data);
		});
	}, []);
	return (
		<View style={[styles.container, {paddingTop: insets.top}]}>
			<Text style={styles.titleText}>PrismPages</Text>
			<TextInput
				style={styles.searchBar}
				placeholder='Rechercher'
				placeholderTextColor="#989898"
				onChangeText={(text) => setAnimes(search(animeList, text))}
			/>
			{loading(animes)}
			<FlatList
				data={animes}
				keyExtractor={(item, index) => index.toString()}
				numColumns={3} 
				renderItem={({ item }) => newAnime(item.name, item.imgUrl, item.pageUrl, setSelectedScan)}
				initialNumToRender={20}
				maxToRenderPerBatch={20}
				style={styles.flatList}
			/>
		</View>
	);
}

function search(animes: any, text: string)
{
	if (!animes)
		return;
	let arr = [];
	const lowerCaseText = text.toLowerCase();
	for (let i = 0; i < animes.length; i++)
	{
		if (animes[i].name.toLowerCase().includes(lowerCaseText))
			arr.push(animes[i]);
	}
	return (arr);
}

function loading(animes: any)
{
	const [loadingText, setLoadingText] = useState("Chargement...");

	if (!animes || animes.length === 0)
	{
		if (interval)
			return (<Text style={styles.loadingText}>{loadingText}</Text>);
		let i = 0;
		interval = setInterval(() => {
			if (animeList && animeList.length > 0)
			{
				clearInterval(interval);
				return;
			}
			i++;
			if (i > 3)
				i = 0;
			let text = "Chargement";
			for (let j = 0; j < i; j++)
				text += ".";
			setLoadingText(text);
		}, 500);
		return (
			<Text style={styles.loadingText}>{loadingText}</Text>
		);
	}
	return (null);

}

function newAnime(name: string, imgUrl: string, pageUrl: string, setSelectedScan: Function)
{
	return (
		<TouchableOpacity onPress={() => setSelectedScan([pageUrl, name, imgUrl])} style={styles.scan} key={pageUrl}>
			<View>
				<Image style={styles.imageScans} source={{uri: imgUrl}}/>
				<Text style={styles.titleScans} numberOfLines={2}>{name}</Text>
			</View>
		</TouchableOpacity>
	);
}

async function fetchAnimeSama()
{
	let page = 1;
	let arr = [];

	while (true)
	{
		const data = await fetch(urlAnimeSama + page);
		let html = await data.text();
		const dom = parseDocument(html);

		const scans = selectAll('#list_catalog', dom);
		if (scans.length === 0)
			break;
		const anime = selectAll('.shrink-0', scans[0]);
		if (anime.length === 0)
			break;
		for (let i = 0; i < anime.length; i++)
		{
			const scan = anime[i];
			let	scan_title;
			let scan_img;
			let scan_url;

			scan_title = selectOne('h1', scan)?.children.length > 0 ? selectOne('h1', scan).children[0].data : null;
			if (!scan_title)
				continue;
			scan_img = selectOne('img', scan)?.attribs.src;
			scan_url = selectOne('a', scan)?.attribs.href;
			if (scan_title && scan_img && scan_url)
				arr.push({ name: scan_title, imgUrl: scan_img, pageUrl: scan_url });
		}
		page++;
	}
	return (arr);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: height - 60,
		padding: 10,
		paddingTop: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	topContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
	},
	titleText: {
		color: 'white',
		marginTop: 5,
		fontSize: 32,
		fontFamily: 'Jersey25-Regular',
	},
	loadingText: {
		color: 'white',
		marginTop: 5,
		fontSize: 32,
		fontFamily: 'Jersey25-Regular',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{translateX: -50}, {translateY: -50}],
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
	flatList: {
		width: '100%',
		display: 'flex',
		padding: 10,
	},
	scan: {
		width: '31.33%',
		margin: '1%',
		marginBottom: 20,
		flexDirection: 'column',
	},
	imageScans: {
		borderRadius: 10,
		height: 150,
	},
	titleScans: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		textAlign: 'center',
		margin: 2.5,
		fontSize: 20,
	},
});

export default HomePage;