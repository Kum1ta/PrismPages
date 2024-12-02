import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View} from 'react-native';

/*
	scan[0] = pageUrl
	scan[1] = name

	fetch('https://anime-sama.fr/s2/scans/' + scan[1] + '/1/1.jpg').then((response) => {
		console.log(response);
	});
*/
function ScanPage({scan}: any)
{
	const	[scanData, setScanData] = useState(null);
	const	[nbChapter, setNbChapter] = useState(0);
	let		data = {};


	scan[0] += "/scan/vf/episodes.js";
	if (!scanData)
	{
		fetch(scan[0])
		.then((response) => {
			if (!response.ok)
				throw new Error('Network response was not ok');
			return (response.text());
		})
		.then((text) => {
			text = newMethodScans(text, data, scan[1]);
			text = '{' + text + '}';
			text = text.replaceAll('var ', '"');
			text = text.replaceAll('= ', '":'); 
			text = text.replaceAll('];', '],');
			text = text.replaceAll("'", '"');
			text = text.replaceAll('],\n\n', '],');
			text = text.replaceAll(',}', '}');
			for (let i = 0; i < text.length; i++)
			{
				if (text[i] === ',')
				{
					let j = i + 1;
					while (j < text.length && (text[j] === ' ' || text[j] === '\n'))
						j++;
					if (text[j] === ']')
						text = text.slice(0, i) + text.slice(i + 1);
				}
			}
			console.log(text);
			let parsed = JSON.parse(text);
			parsed = {...parsed, ...data};
			setScanData(parsed);
			setNbChapter(Object.keys(parsed).length);
			console.log('Size:', Object.keys(parsed).length);
			console.log(parsed);
		})
		.catch((error) => console.warn('Erreur lors du fetch:', error));
	}
	return (
		<View style={styles.body}>
			<ScrollView>
				<View style={styles.chapScrollView}>
					{Array.from({ length: nbChapter }, (_, index) => (
						<TouchableOpacity key={index} style={styles.chapButton}>
							<Text style={styles.buttonText}>{index + 1}</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
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

const styles = StyleSheet.create({
	body: {
		backgroundColor: '#2A2D34',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100%',
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
	},
	buttonText: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		textAlign: 'center',
		fontSize: 24,
	},
});

export default ScanPage;