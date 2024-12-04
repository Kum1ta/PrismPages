import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Dimensions, StyleSheet, BackHandler} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';

const width = Dimensions.get('window').width;
let index = 0;

const ReadingPage = ({ reading, setReading, selectedScan }: any) => {
	const [hide, setHide] = useState(true);
	const [imageHeights, setImageHeights] = useState<Record<number, number>>({});
	const [reloadKeys, setReloadKeys]: any = useState({});
	const [loadedImages, setLoadedImages] = useState<string[]>([]);
	const flatListRef = useRef(null);

	useEffect(() => {
		while (index < reading.scan['eps' + reading.chapter].length)
		{
			const uri = reading.scan['eps' + reading.chapter][index];
			calculateImageHeight(uri, index);
			console.log('calculating image height for index:', index);

			let fileName = uri.split('/').pop();
			const localPath = `${RNFS.CachesDirectoryPath}/${fileName}.jpg`;

			RNFS.exists(localPath).then((exists) => {
				new Promise((resolve) => {
					if (exists)
					{
						loadedImages.push('file:/' + localPath);
						resolve(null);
					}
					else
					{
						RNFS.downloadFile({
							fromUrl: uri,
							toFile: localPath,
						}).promise.then(() => {
							loadedImages.push('file:/' + localPath);
							resolve(null);
						}).catch((err) => {
							console.error(err);
						});
					}
				}).then(() => {
					if (loadedImages.length === reading.scan['eps' + reading.chapter].length)
					{
						console.log('All images loaded');
						console.log('loadedImages:', loadedImages);
					}
				});

			}).catch((err) => {
				console.error(err);
			});

			index++;
		}
		function onBackPress()
		{
			setReading({ bool: false, scan: null, chapter: 1 });
			return (true);
		}

		BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return (() => {BackHandler.removeEventListener('hardwareBackPress', onBackPress); index = 0;});
	}, []);

	const calculateImageHeight = (uri: string, index: number) => {
		Image.getSize(
			uri,
			(originalWidth, originalHeight) => {
				const calculatedHeight = (originalHeight / originalWidth) * width;
				setImageHeights((prevHeights) => ({
					...prevHeights,
					[index]: calculatedHeight,
				}));
			},
			(error) => {
				console.error(`Couldn't get the image size: ${error.message}`);
			}
		);
	};

	const handlePrevious = useCallback(() => {
		flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
		index = 0;
		setReading({ bool: true, scan: reading.scan, chapter: reading.chapter - 1 });
	}, [reading, setReading]);

	const handleNext = useCallback(() => {
		flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
		setReading({ bool: true, scan: reading.scan, chapter: reading.chapter + 1 });
	}, [reading, setReading]);

	const renderItem = useCallback(
		({ item, index } :any) => (
			<Image
				// key={reloadKeys[index]} 
				source={{ uri: [console.log("Hello: ", item), item.replace('file://', '')][1] }}
				style={{
					width: width,
					height: imageHeights[index],
				}}
				// resizeMode="contain"
			/>
		),
		[imageHeights, calculateImageHeight]
	);

	const topBarTitle = useMemo(() => {
		const title = selectedScan[1];
		return (title.length > 20 ? `${title.slice(0, 20)}...` : title);
	}, [selectedScan]);

	return (
		<View style={styles.body}>
			{loadedImages.length !== reading.scan['eps' + reading.chapter].length ? (
				<Text style={styles.title}>Loading...</Text>
			) : (
				<>
					<StatusBar hidden={hide} />
					<View style={styles.topBar}>
						<TouchableOpacity onPress={() => setReading({ bool: false, scan: null, chapter: 1 })} style={styles.arrowBack}>
							<Image source={require('../assets/icons/arrow.png')} style={{ width: '100%', height: '100%' }} />
						</TouchableOpacity>
						<Text style={styles.title}>{topBarTitle}</Text>
						<View style={{ position: 'absolute', right: 15 }}>
							<Text style={[styles.title, { textAlign: 'center' }]}>CHAP</Text>
							<Text style={[styles.title, { textAlign: 'center', marginTop: -5 }]}>{reading.chapter}</Text>
						</View>
					</View>
					<View style={styles.bottomBar}>
						<TouchableOpacity onPress={handlePrevious} disabled={reading.chapter === 1}>
							<Text style={[styles.title, { color: reading.chapter !== 1 ? 'white' : '#8f8f8f' }]}>Précedent</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleNext} disabled={!reading.scan['eps' + (reading.chapter + 1)]}>
							<Text style={[styles.title, { color: reading.scan['eps' + (reading.chapter + 1)] ? 'white' : '#8f8f8f' }]}>
								Suivant
							</Text>
						</TouchableOpacity>
					</View>
					<FlatList
						ref={flatListRef}
						data={loadedImages}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderItem}
						initialNumToRender={5}
						maxToRenderPerBatch={5}
						windowSize={10}
						style={styles.flatList}
					/>
				</>
			)}
		</View>
	);
};
  

const styles = StyleSheet.create({
	body: {
		width: '100%',
		height: '100%',
		backgroundColor: '#2A2D34',
	},
	topBar: {
		width: '100%',
		height: 60,
		position: 'absolute',
		backgroundColor: '#262626',
		flexDirection: 'row',
		alignItems: 'center',
		elevation: 150,
		zIndex: 150,
	},
	arrowBack: {
		marginLeft: 10,
		marginRight: 10,
		width: 30,
		height: 30,
		elevation: 150,
		zIndex: 150,
	},
	title: {
		color: 'white',
		fontFamily: 'Jersey25-Regular',
		fontSize: 24,
		margin: 0,
	},
	bottomBar: {
		position: 'absolute',
		bottom: 0,
		width: '99.9%',
		height: 60,
		backgroundColor: '#262626',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		elevation: 150,
		zIndex: 150,
	},
	flatList: {
		width: '100%',
		display: 'flex',
		padding: 10,
	},
});

  export default React.memo(ReadingPage);