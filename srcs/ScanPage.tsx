import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, BackHandler, TouchableOpacity, View, Image} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { parseDocument } from 'htmlparser2';
import { selectOne } from 'css-select';

/*
	scan[0] = pageUrl
	scan[1] = name
	scan[2] = imgUrl
*/

function ScanPage({scan, setSelectedScan, setReading}: any)
{
	const	[scanData, setScanData] = useState(null);
	const	[nbChapter, setNbChapter] = useState(0);
	const	[synopsis, setSynopsis] = useState(null);
	let		data = {};
	let		website = 'https://anime-sama.fr/catalogue/';

	useEffect(() => {
		function onBackPress()
		{
			setSelectedScan(null);
			return (true);
		}
		BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return (() => BackHandler.removeEventListener('hardwareBackPress', onBackPress));
	});
	if (!scan[0].includes('/scan/vf/episodes.js'))
		scan[0] += "/scan/vf/episodes.js";
	if (!scanData)
	{
		getDataChapters(data, scan, setScanData, setNbChapter);
		getSynopsis(website, scan, setSynopsis);
	}
	return (
		<View style={styles.body}>
			<View style={styles.imgTop}>
				<TouchableOpacity onPress={() => setSelectedScan(null)} style={styles.arrowBack}>
					<Image source={require('../assets/icons/arrow.png')} style={{width: '100%', height: '100%'}}/>
				</TouchableOpacity>
				<Image source={{uri: scan[2]}} style={{width: '100%', height: '100%'}}/>
				<LinearGradient
					colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.6)']}
					style={styles.gradientOverlay}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				/>
				<LinearGradient
					colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.2)']}
					style={styles.gradientOverlay}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
				/>
				<Text style={styles.titleScan}>{scan[1]}</Text>
			</View>
			<ScrollView>
				<Text style={styles.h2Text}>Synopsis</Text>
				<Text style={styles.synopsis}>{synopsis}</Text>
				<Text style={styles.h2Text}>Chapitres</Text>
				<View style={styles.chapScrollView}>
					{Array.from({ length: nbChapter }, (_, index) => (
						<TouchableOpacity key={index} style={styles.chapButton} onPress={() => setReading({bool: true, scan: scanData, chapter: index + 1})}>
							<Text style={styles.buttonText}>{index + 1}</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

function removeAllComments(text: string, comment: string)
{
	let	pos;
	let	posEnd;
	
	pos = text.indexOf(comment);
	while (pos !== -1)
	{
		if (comment === '//' && text[pos - 1] === ':')
		{
			pos = text.indexOf(comment, pos + 1);
			continue;
		}
		if (comment === '//')
			posEnd = text.indexOf('\n', pos);
		else
			posEnd = text.indexOf('*/', pos);
		if (posEnd === -1)
			break;
		text = text.slice(0, pos) + text.slice(posEnd + 1);
		pos = text.indexOf(comment, pos);
	}
	if (comment === '//')
		text = removeAllComments(text, '/*');
	return (text);
}

function isWhitespace(char: string)
{
	return (/^\s$/.test(char));
  }

function parsingData(text: string)
{
	text = '{' + text;
	text = text.replaceAll('var ', '"');
	for (let i = 0; i < text.length; i++)
	{
		if (text[i] === '=')
		{
			let j = i - 1;
			while (j > 0 && isWhitespace(text[j]))
				j--;
			if (text[j] >= '0' && text[j] <= '9')
			{
				j = i + 1;
				while (j < text.length && isWhitespace(text[j]))
					j++;
				if (text[j] === '[')
					text = text.slice(0, i) + '":' + text.slice(i + 1);
			}
		}
	}
	for (let i = text.length - 1; i > 0; i--)
	{
		if (text[i] === ']')
		{
			while (i > 0 && text[i] !== ',')
				i--;
			if (text[i] === ',')
				text = text.slice(0, i) + text.slice(i + 1);
		}
	}
	for (let i = 0; i < text.length; i++)
	{
		if (text[i] === ']')
		{
			while (i < text.length && text[i] !== ';')
				i++;
			if (text[i] === ';')
				text = text.slice(0, i) + ',' + text.slice(i + 1);
		}

	}
	let pos = text.length - 1;
	while (pos > 0 && text[pos] !== ']')
		pos--;
	text = text.slice(0, pos + 1) + '}'
	text = text.replaceAll('\'', '"');
	return (text);
}

function newMethodScans(text: string, data: any, name: string)
{
	const	toFind = '=[];';
	let		pos;
	let		posEqual;
	let		posCut;
	let		split;
	
	pos = text.indexOf(toFind);
	if (pos === -1)
		return (text);
	posCut = 0;
	for (let i = pos; i > 0; i--)
	{
		if (text[i] === '\n')
		{
			posCut = i;
			break;
		}
	}
	if (posCut === 0)
	{
		split = text;
		text = '';
	}
	else
	{
		split = text.slice(posCut + 1);
		text = text.slice(0, posCut + 1);
	}
	while (split.length)
	{
		let	nbChapter;
	
		nbChapter = 0;
		pos = split.indexOf('eps');
		if (pos === -1)
			break;
		pos += 3;
		posEqual = split.indexOf('=', pos);
		if (posEqual === -1)
			break;
		while (pos < posEqual)
		{
			nbChapter = nbChapter * 10 + parseInt(split[pos]);
			pos++;
		}
		pos = split.indexOf('.length = ', posEqual);
		if (pos === -1)
			break;
		pos += 10;
		posEqual = split.indexOf(';', pos);
		if (posEqual === -1)
			break;
		let nbPages = 0
		while (pos < posEqual)
		{
			nbPages = nbPages * 10 + parseInt(split[pos]);
			pos++;
		}
		split = split.slice(posEqual + 1);
		createAllUrl(data, nbChapter, nbPages, name);
	}
	return (text);
}

function createAllUrl(data: any, nbChatper: number, nbPages: number, name: string)
{
	let	url;

	data['eps' + nbChatper] = [];
	url = 'https://anime-sama.fr/s2/scans/';
	for (let i = 0; i < nbPages; i++)
		data['eps' + nbChatper].push(url + name.replaceAll(' ', '%20') + '/' + nbChatper + '/' + (i + 1) + '.jpg');
}

function getDataChapters(data: any, scan: any, setScanData: any, setNbChapter: any)
{
	fetch(scan[0])
	.then((response) => {
		if (!response.ok)
			throw new Error('Network response was not ok');
		return (response.text());
	})
	.then((text) => {
		text = removeAllComments(text, '//');
		text = newMethodScans(text, data, scan[1]);
		text = parsingData(text);
		let parsed = {...JSON.parse(text), ...data};
		setScanData(parsed);
		setNbChapter(Object.keys(parsed).length);
	})
	.catch((error) => console.warn('Error fetch (Chapters):', error));
}

function getSynopsis(website: string, scan: any, setSynopsis: any)
{
	website += scan[1].replaceAll(' ', '-');
	website = website.toLowerCase();
	website = removeUselessChar(website);
	fetch(website)
	.then((response) => {
		if (!response.ok)
			throw new Error('Network response was not ok');
		return (response.text());
	})
	.then((text) => {
		const dom = parseDocument(text);
		setSynopsis(selectOne('.text-sm.text-gray-400.mt-2', dom)?.children[0].data);
	})
	.catch((error) => console.warn('Error fetch (Synopsis):', error));
}

function removeUselessChar(text: string)
{
	text = text.replaceAll('#', '');
	text = text.replaceAll('&', 'and');
	text = text.replaceAll('\'', '');
	text = text.replaceAll(',', '');
	text = text.replaceAll('!', '');
	text = text.replaceAll('(', '');
	text = text.replaceAll(')', '');
	text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	return (text);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: '#2A2D34',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	},
	imgTop: {
		width: '100%',
		height: 200,
		marginBottom: 15,
	},
	shadow: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		borderRadius: 30,
		elevation: 10,
	},
	chapScrollView: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		padding: 10,
	},
	chapButton: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		backgroundColor: '#262626',
		width: '20%',
		height: 40,
		margin: 5,
		display: 'flex',
		justifyContent: 'center',
		borderRadius: 10,
	},
	buttonText: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		textAlign: 'center',
		fontSize: 24,
	},
	gradientOverlay: {
		...StyleSheet.absoluteFillObject,
	},
	arrowBack: {
		position: 'absolute',
		top: 10,
		left: 10,
		width: 40,
		height: 40,
		elevation: 150,
		zIndex: 150,
	},
	titleScan: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		fontSize: 34,
	},
	h2Text: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		fontSize: 28,
		marginTop: 25,
		marginLeft: 15,
	},
	synopsis: {
		color: '#BFBFBF',
		fontFamily: 'Jersey25-Regular',
		fontSize: 20,
		marginTop: 5,
		marginLeft: '5%',
		marginRight: '5%',
	},
});

export default ScanPage;