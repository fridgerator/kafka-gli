import React from 'react';
import { Box, useFocus } from 'ink';
import Scrollable from '../components/scrollable.js';
import Table from './table.js'

export default function GroupOffsets(props: {offsets: any[]}) {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      <Table data={props.offsets} />
    </Scrollable>
  </Box>
}