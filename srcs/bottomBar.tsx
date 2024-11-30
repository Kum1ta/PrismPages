import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const myIcon = <Icon name="rocket" size={30} color="#900" />;

const BottomBar = () =>
{
	return (
		<View>
			{myIcon}
		</View>
	);
}

export default BottomBar;