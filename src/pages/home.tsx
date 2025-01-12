import React from 'react';
import SelectInput from 'ink-select-input';
import { useStore } from '../utils/store.js';
import { Box } from 'ink';

export default function Home() {
	const setPage = useStore((state) => state.setPage)

	const menu = [
		{
			label: "Topics",
			value: "topics"
		},
		{
			label: "Consumer groups",
			value: "consumer-groups"
		}
	]

	const onSelect = (item: any) => {
		setPage(item.value);
	}

	return <Box height="10%" width="100%" borderColor="blue" borderStyle="round">
		<SelectInput items={menu} onSelect={onSelect} />
	</Box>
}
