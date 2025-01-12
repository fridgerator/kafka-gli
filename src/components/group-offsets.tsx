import React from 'react';
import { Box, Text, useFocus } from 'ink';
import Scrollable from '../components/scrollable.js';

export default function GroupOffsets(props: {offsets: any}) {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      <Text>{JSON.stringify(props.offsets, null, 2)}</Text>
    </Scrollable>
  </Box>
}