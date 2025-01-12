import React, { useCallback, useEffect, useState } from 'react';
import SelectInput from 'ink-select-input';
import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import { Box, Text, useFocus, useFocusManager } from 'ink';
import { EachMessagePayload } from 'kafkajs';

interface TopicSelectorProps {
  groups: { label: string, value: string }[]
  onSelect: any
}
const TopicSelector = (props: TopicSelectorProps) => {
  const { isFocused } = useFocus();

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"}>
    <SelectInput items={props.groups} onSelect={props.onSelect} isFocused={isFocused} />
  </Box>
}

const KafkaMessages = (props: {messages: string[]}) => {
  const { isFocused } = useFocus();

  return <Box borderStyle={"single"} width="100%" borderColor={isFocused ? "blue" : "white"}>
    <Text>{JSON.stringify(props.messages, null, 2)}</Text>
  </Box>
}

export default function ListTopics() {
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [topics, setTopics] = useState<{ label: string, value: string }[]>([]);
  const [messages, setMessages] = useState<string[]>([])
  const {focusNext} = useFocusManager();

	useEffect(() => {
		focusNext();
	}, []);

  const onSelect = async (item: { label: string, value: string }) => {
    setSelectedTopic(item.value);
  }

  const addMessage = useCallback(
    (payload: EachMessagePayload) => {
      setMessages(prevMessages => [
        ...prevMessages,
        payload.message.value!.toString()
      ])
    }, [])

  useEffect(() => {
    if (!selectedTopic) return;

    const consumeMessages = async () => {
      const consumerClient = await KafkaGliClient.getConsumerClient();
      // if consumer is already running "susbscribe" will throw an exception, always stop before subscribing again
      await consumerClient?.stop();
      await consumerClient?.subscribe({ topics: [selectedTopic] })
      consumerClient?.run({
        eachMessage: async (msg) => {
          addMessage(msg)
        }
      })
    }

    consumeMessages();
  }, [selectedTopic])

  useEffect(() => {
    const getTopics = async () => {
      const adminClient = await KafkaGliClient.getAdminClient();
      const topicsList = await adminClient?.listTopics();
      if (!topicsList) return;
      setTopics(
        topicsList.map((t) => ({ label: t, value: t }))
      );
    }

    getTopics();
  }, [])

  return (
    <Box flexDirection="column">
      <Box height="10%">
        <Box width="100%">
          <TopicSelector groups={topics} onSelect={onSelect} />
        </Box>
      </Box>
      <Box height="90%" overflowY='hidden'>
        <Box width="100%" overflowY='hidden'>
          <KafkaMessages messages={messages} />
        </Box>
      </Box>
    </Box>
  )
}
