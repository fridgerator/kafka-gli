import React from 'react';
import { Text } from 'ink';
import PageSelect from './components/page-select.js';
import { useStore } from './utils/store.js';
import ListTopics from './components/list-topics.js';

export default function App() {
	const page = useStore((state) => state.page);

	if (page === "home") return <PageSelect />
	if (page === "list-topics") return <ListTopics />

	return (
		<Text>done</Text>
	)
}
