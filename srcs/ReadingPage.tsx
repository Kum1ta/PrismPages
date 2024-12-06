import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Dimensions, StyleSheet, BackHandler, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ReadingPage = ({ reading, setReading, selectedScan }: any) => {
	const [hide, setHide] = useState(false);
	const [imageHeights, setImageHeights] = useState<Record<number, number>>({});
	const [loadedImages, setLoadedImages] = useState<string[]>([]);
	const [textLoading, setTextLoading] = useState<string>(`Loading 0/${reading.scan['eps' + reading.chapter].length} images`);
	const flatListRef = useRef<FlatList>(null);

	useEffect(() => {
		setHide(false);
		addToHistory(selectedScan, reading.chapter);
		for (let index: number = 0; index < reading.scan['eps' + reading.chapter].length; index++)
		{
			const uri = reading.scan['eps' + reading.chapter][index];
			calculateImageHeight(uri, index);

			let fileName = selectedScan[1].replace(/[^a-zA-Z0-9]/g, '') + '-' + reading.chapter + '-' + (index + 1);
			const localPath = `file://${RNFS.CachesDirectoryPath}/${fileName}.jpg`;

			RNFS.exists(localPath).then((exists) => {
				new Promise((resolve) => {
					if (exists)
					{
						loadedImages.push(localPath);
						resolve(null);
					}
					else
					{
						RNFS.downloadFile({
							fromUrl: uri,
							toFile: localPath,
						}).promise.then(() => {
							loadedImages.push(localPath);
							resolve(null);
						}).catch((err) => {
							console.error(err);
						});
					}
				}).then(() => {
					if (loadedImages.length === reading.scan['eps' + reading.chapter].length)
					{
						loadedImages.sort((a, b) => {
							return a.localeCompare(b, undefined, { numeric: true });
						});
						setLoadedImages([...loadedImages]);
					}
					else
						setTextLoading(`Loading ${loadedImages.length}/${reading.scan['eps' + reading.chapter].length} images`);
				});
			}).catch((err) => {
				console.error(err);
			});
		}
		function onBackPress()
		{
			setReading({ bool: false, scan: null, chapter: 1 });
			return (true);
		}
		BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return (() => {BackHandler.removeEventListener('hardwareBackPress', onBackPress)});
	}, [reading.chapter]);

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
		setImageHeights({});
		setLoadedImages([]);
		setTextLoading(`Loading 0/${reading.scan['eps' + (reading.chapter - 1)].length} images`);
		setReading({ bool: true, scan: reading.scan, chapter: reading.chapter - 1 });
	}, [reading, setReading]);

	const handleNext = useCallback(() => {
		flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
		setImageHeights({});
		setLoadedImages([]);
		setTextLoading(`Loading 0/${reading.scan['eps' + (reading.chapter + 1)].length} images`);
		setReading({ bool: true, scan: reading.scan, chapter: reading.chapter + 1 });
	}, [reading, setReading]);

	const topBarTitle = useMemo(() => {
		const title = selectedScan[1];
		return (title.length > 20 ? `${title.slice(0, 20)}...` : title);
	}, [selectedScan]);

	const showScans = useCallback(() => {
		return (
			<TouchableWithoutFeedback
				style={{ width: width, height: height }}
				onLongPress={() => {
					setHide(!hide);
				}}
			>
				<WebView source={{html: `
					<html>
					<head>
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
					</head>
					<body style="margin: 0; padding: 0; width: 100%; height: 100%; background-color: #2A2D34;">
						${loadedImages.map((img, index) => {return `<img src="${img}" style="width: 100%" />` }).join('')}
						<script>
                        let lastTap = 0;
                        document.addEventListener('touchend', function (e) {
                            const currentTime = new Date().getTime();
                            const tapLength = currentTime - lastTap;
                            if (tapLength < 300 && tapLength > 0) {
                                e.preventDefault(); // Bloque le double tap
                            }
                            lastTap = currentTime;
                        });
                    </script>
					</body>
					</html>
				`, baseUrl: ''}} 
				originWhitelist={['*']}
				allowFileAccess={true}
				allowFileAccessFromFileURLs={true}
				/>
			</TouchableWithoutFeedback>
		);
	}, [reading.chapter, hide]);

	return (
		<View style={styles.body}>
			{loadedImages.length !== reading.scan['eps' + reading.chapter].length ? (
				<Text style={[styles.title, styles.loadingText]}>{textLoading}</Text>
			) : (
				<>
					<StatusBar hidden={hide} />
					{!hide && 
					<View style={styles.topBar}>
						<TouchableOpacity onPress={() => setReading({ bool: false, scan: null, chapter: 1 })} style={styles.arrowBack}>
							<Image source={require('../assets/icons/arrow.png')} style={{ width: '100%', height: '100%' }} />
						</TouchableOpacity>
						<Text style={styles.title}>{topBarTitle}</Text>
						<View style={{ position: 'absolute', right: 15 }}>
							<Text style={[styles.title, { textAlign: 'center' }]}>CHAP</Text>
							<Text style={[styles.title, { textAlign: 'center', marginTop: -5 }]}>{reading.chapter}</Text>
						</View>
					</View>}
					{!hide && 
					<View style={styles.bottomBar}>
						<TouchableOpacity onPress={handlePrevious} disabled={reading.chapter === 1}>
							<Text style={[styles.title, { color: reading.chapter !== 1 ? 'white' : '#8f8f8f' }]}>Précedent</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleNext} disabled={!reading.scan['eps' + (reading.chapter + 1)]}>
							<Text style={[styles.title, { color: reading.scan['eps' + (reading.chapter + 1)] ? 'white' : '#8f8f8f' }]}>
								Suivant
							</Text>
						</TouchableOpacity>
					</View>}
					{showScans()}
				</>
			)}
		</View>
	);
};

function addToHistory(scan: any, chapter: number)
{
	const validName = scan[1].replace(/[^a-zA-Z0-9]/g, '');
	const history = {
		name: scan[1],
		imgUrl: scan[2],
		chapter: chapter,
		pageUrl: scan[0],
		time: new Date().getTime(),
	};
	AsyncStorage.setItem(validName, JSON.stringify(history));
}


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
	loadingText: {
		textAlign: 'center',
		marginTop: '50%',
	},
});

  export default React.memo(ReadingPage);