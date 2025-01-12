import React from 'react';
import { Box, Text, useFocus } from 'ink';

export default function KafkaMessages(props: {messages: string[]}) {
  const { isFocused } = useFocus();

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"}>
    <Text>{JSON.stringify(props.messages, null, 2)}</Text>
  </Box>
}