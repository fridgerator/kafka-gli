import React from 'react';
import { Text, Box, useInput } from 'ink';

import { useStore } from './utils/store.js';
import { FullScreen } from './utils/fullscreen.js';
import Home from './pages/home.js';
import Topics from './pages/topics.js';
import ConsumerGroups from './pages/consumer-groups.js'

const IS_FULLSCREEN = true; // false only for debugging

export default function App() {
	const page = useStore((state) => state.page);
	const historyBack = useStore((state) => state.historyBack);

	useInput((_input, key) => {
		if (key.escape) {
			return historyBack()
		}
	})

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <Home />
			case 'topics':
				return <Topics />
			case 'consumer-groups':
				return <ConsumerGroups />
			default:
				return <Text>no page</Text>
		}
	}

	if (IS_FULLSCREEN) {
		return (
			<FullScreen>
				{renderPage()}
			</FullScreen>
		)
	}

	return (
		<Box>
			{renderPage()}
		</Box>
	)
}
