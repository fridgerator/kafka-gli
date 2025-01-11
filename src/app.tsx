import React from 'react';
import { Text, Box } from 'ink';
import { useStore } from './utils/store.js';
import { FullScreen } from './utils/fullscreen.js';
import PageSelect from './components/page-select.js';
import ListTopics from './components/list-topics.js';
import ListGroups from './components/list-groups.js';

const IS_FULLSCREEN = true; // false only for debugging

export default function App() {
	const page = useStore((state) => state.page);

	const renderPage = () => {
		switch (page) {
			case 'home':
				return <PageSelect />
			case 'list-topics':
				return <ListTopics />
			case 'list-groups':
				return <ListGroups />
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
