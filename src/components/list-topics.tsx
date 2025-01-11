import React, { useEffect, useState } from 'react';
import SelectInput from 'ink-select-input';
import { KafkaGliClient } from '../utils/kafka-gli-client.js';

export default function ListTopics() {
  const [topics, setTopics] = useState<{label: string, value: string}[]>([]);

  const onSelect = (item: {label: string, value: string}) => {
    console.log('selected topic : ', item);
  }

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

  return <SelectInput items={topics} onSelect={onSelect} />
}
