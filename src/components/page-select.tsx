import React from 'react';
import SelectInput from 'ink-select-input';
import { useStore } from '../utils/store.js';

export default function PageSelect() {
	const setPage = useStore((state) => state.setPage)

  const menu = [
		{
			label: "List topics",
			value: "list-topics"
		}
	]
	
	const onSelect = (item: any) => {
		setPage(item.value);
	}

	return <SelectInput items={menu} onSelect={onSelect} />
}
