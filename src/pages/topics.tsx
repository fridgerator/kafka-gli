import React, { useCallback, useEffect, useState } from 'react';
import { Box, useFocusManager } from 'ink';
import { EachMessagePayload } from 'kafkajs';

import TopicSelector from '../components/topic-selector.js';
import KafkaMessages from '../components/kafka-messages.js';
import { SelectInputItem } from "../utils/types.js"
import { KafkaGliClient } from '../utils/kafka-gli-client.js';

export default function Topics() {
  const [topics, setTopics] = useState<SelectInputItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [messages, setMessages] = useState<EachMessagePayload[]>([])
  const {focusNext} = useFocusManager();

  useEffect(() => {
    focusNext();
  }, [])

  const addMessage = useCallback(
      (payload: EachMessagePayload) => {
        setMessages(prevMessages => [
          ...prevMessages,
          payload
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

      return () => {
        KafkaGliClient.getConsumerClient().then(client => {
          client.stop().catch(e => console.log('error : ', e))
        })
      }
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

  const onSelect = async (item: SelectInputItem) => {
    setSelectedTopic(item.value);
  }

  return (
    <Box flexDirection="column">
      <Box height="10%">
        <Box width="100%">
          <TopicSelector topics={topics} onSelect={onSelect} />
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