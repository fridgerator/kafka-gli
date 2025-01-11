import React, { useCallback, useEffect, useState } from 'react';
import SelectInput from 'ink-select-input';
import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import { Box, Text } from 'ink';
import { EachMessagePayload } from 'kafkajs';

export default function ListTopics() {
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [topics, setTopics] = useState<{label: string, value: string}[]>([]);
  const [messages, setMessages] = useState<string[]>([])

  const onSelect = async (item: {label: string, value: string}) => {
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
      await consumerClient?.subscribe({ topics: [selectedTopic], fromBeginning: true })
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
        topicsList.map((t) => ({label: t, value: t}))
      );
    }

    getTopics();
  }, [])

  const renderMessages = () => {
    return <>
      {messages.map((message, i) => (
        <Box key={i} width="100%" height="2">
          <Text>{message}</Text>
        </Box>
      ))}
    </>
  }

  return (
    <Box flexDirection="column">
      <Box height="10%">
        <Box borderStyle="single" width="100%">
          <SelectInput items={topics} onSelect={onSelect} />
        </Box>
      </Box>
      <Box height="90%" overflowY='hidden'>
        <Box borderStyle="single" width="100%" flexDirection='column'>
          {renderMessages()}
        </Box>
      </Box>
    </Box>
  )
}
