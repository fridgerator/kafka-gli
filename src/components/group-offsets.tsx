import React from 'react';
import { Box, Text, useFocus } from 'ink';
import Scrollable from '../components/scrollable.js';
import Table from './table.js'

export default function GroupOffsets(props: {offsets: any[]}) {
  const { isFocused } = useFocus();

  const table = () => {
    if (props.offsets.length === 0) return <Text>no table data</Text>
    return <Table data={props.offsets} />
  }

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      {table()}
    </Scrollable>
  </Box>
}