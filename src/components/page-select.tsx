import React from 'react';
import SelectInput from 'ink-select-input';
import { useStore } from '../utils/store.js';
import { Box } from 'ink';

export default function PageSelect() {
	const setPage = useStore((state) => state.setPage)

	const menu = [
		{
			label: "List topics",
			value: "list-topics"
		},
		{
			label: "List groups",
			value: "list-groups"
		}
	]

	const onSelect = (item: any) => {
		setPage(item.value);
	}

	return <Box height="10%" width="100%" borderColor="blue" borderStyle="round">
		<SelectInput items={menu} onSelect={onSelect} />
	</Box>
}
