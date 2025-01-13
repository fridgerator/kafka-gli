import React from 'react';
import { Box, Text, useFocus } from 'ink';


const Message = (props: {message: any}) => {
  const getDate = (ts: string) => {
    return new Date(parseInt(ts)).toString()
  }

  return <Box borderStyle="double" width="100%" flexDirection="column" borderTop={false} borderLeft={false} borderRight={false}>
    <Box width="100%">
      <Box padding={1}>
        <Text>topic: {props.message.topic}</Text>
      </Box>
      <Box padding={1}>
        <Text>partition: {props.message.partition}</Text>
      </Box>
      <Box padding={1}>
        <Text>offset: {props.message.message.offset}</Text>
      </Box>
      <Box padding={1}>
        <Text>timestamp: {getDate(props.message.message.timestamp)}</Text>
      </Box>
    </Box>
    <Box width="100%" padding={1}>
      <Text>{props.message.message.value.toString()}</Text>
    </Box>
  </Box>
}

export default function KafkaMessages(props: {messages: any[]}) {
  const { isFocused } = useFocus();

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"} flexDirection="column">
    {props.messages.map((message) =><Message message={message} />)}
  </Box>
}