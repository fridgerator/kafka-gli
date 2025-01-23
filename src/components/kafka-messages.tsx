import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, measureElement, useInput } from 'ink';
import { EachMessagePayload } from 'kafkajs';

const Message = (props: {message: EachMessagePayload, fn: Function}) => {
  const ref: any = useRef()

  const getDate = (ts: string) => {
    return new Date(parseInt(ts)).toString()
  }

  useEffect(() => {
    const { width, height } = measureElement(ref.current);
    props.fn(width, height)
  }, [])

  return <Box borderStyle="single" width="100%" ref={ref}>
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
      <Text>{props.message.message.value?.toString().slice(0, 275)}</Text>
    </Box>
  </Box>
}

export default function KafkaMessages(props: {messages: EachMessagePayload[]}) {
  const { isFocused } = useFocus();
  const containerRef: any = useRef()
  const [ topElIdx, setTopElIdx ] = useState(0);
  const [ containerSize, setContainerSize ] = useState({width: 0, height: 0});
  const [ messageWidth, setMessageWidth ] = useState(0);
  const [ messageHeight, setMessageHeight ] = useState(0);

  const childSize = (width: number, height: number) => {
    if (!width || !height) return;
    if (messageWidth !== width) setMessageWidth(width)
    if (messageHeight !== height) setMessageHeight(height);
  }

  useEffect(() => {
    const size = measureElement(containerRef.current);
    setContainerSize(size);
  }, [])

  useInput((_input, key) => {
    if (!isFocused) return;
    if (key.downArrow) {
      if (topElIdx == props.messages.length - 1) return;
      setTopElIdx(topElIdx + 1)
    }

    if (key.upArrow) {
      if (topElIdx == 0) return;
      setTopElIdx(topElIdx - 1)
    }
  })

  const shouldRenderMessage = (idx: number) => {
    if (idx < topElIdx) return false
    const elMargin = 1; // where to get this value from?
    const messagesPerPage = Math.floor(containerSize.height / (messageHeight + elMargin))
    if (idx < topElIdx + messagesPerPage) return true
    return false
  }

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"} flexDirection='column' overflow='hidden' ref={containerRef}>
    {props.messages.map((message, i) => shouldRenderMessage(i) && <Message key={i} message={message} fn={childSize} />)}
  </Box>
}
