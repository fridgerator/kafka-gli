import React from 'react';
import { Box, useFocus } from 'ink';
import SelectInput from 'ink-select-input';

interface GroupSelectorProps {
  groups: { label: string, value: string }[]
  onSelect: any
}

export default function GroupSelector(props: GroupSelectorProps) {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"}>
    <SelectInput items={props.groups} onSelect={props.onSelect} isFocused={isFocused} />
  </Box>
}
