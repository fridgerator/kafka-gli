import React from 'react';
import { Box, useFocus } from 'ink';
import SelectInput from 'ink-select-input';
import { SelectInputItem } from "../utils/types.js"

interface TopicSelectorProps {
  topics: SelectInputItem[]
  onSelect: any
}
export default function TopicSelector(props: TopicSelectorProps) {
  const { isFocused } = useFocus();

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"}>
    <SelectInput items={props.topics} onSelect={props.onSelect} isFocused={isFocused} />
  </Box>
}
