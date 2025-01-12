import React, { useState } from 'react';
import { Box, useInput } from 'ink';

interface ScrollabelProps {
  distance?: number
  children: any
  isFocused: boolean
}

const Scrollable = (props: ScrollabelProps) => {
  const [top, setTop] = useState(0);

  useInput((_input, key) => {
    if (!props.isFocused) return;
    const distance = props.distance || 3

    if (key.downArrow) {
      setTop(top - distance)
    }

    if (key.upArrow) {
      if (top === 0) return;
      setTop(top + distance)
    }
  })

  return <Box marginTop={top}>
    {props.children}
  </Box>
}

export default Scrollable