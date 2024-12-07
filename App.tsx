import React from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import DefaultParent from './srcs/DefaultParent';

const Default = () => {
	return (
		<SafeAreaProvider>
			<DefaultParent />
		</SafeAreaProvider>
	);
};

export default Default;