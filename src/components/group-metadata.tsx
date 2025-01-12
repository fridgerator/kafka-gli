import React from 'react';
import { Box, Text, useFocus } from 'ink';
import Scrollable from '../components/scrollable.js';

export default function GroupMetadata(props: {description: any}) {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      <Text>{JSON.stringify(props.description, null, 2)}</Text>
    </Scrollable>
  </Box>
}