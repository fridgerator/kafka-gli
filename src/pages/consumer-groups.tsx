import React, { useEffect, useState } from 'react';
import { Box, useFocusManager } from 'ink';
import { GroupDescription } from 'kafkajs';

import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import GroupSelector from '../components/group-selector.js';
import GroupMetadata from '../components/group-metadata.js';
import GroupOffsets from '../components/group-offsets.js';

interface KafkaMessagesTableData {
  topic: string
  groupId: string
  topicOffset?: string
  groupOffset: string
  lag: number
}

interface TopicPartition {
  partition: number,
  offset: string,
  high: string,
  low: string
}

export default function ConsumerGroups() {
  const [groups, setGroups] = useState<{ label: string, value: string }[]>([]);
  const [selectedGroupDescription, setSelectedGroupDescription] = useState<GroupDescription[] | undefined>();
  const [groupOffsets, setGroupOffsets] = useState<any[]>([]);
  const {focusNext} = useFocusManager();

  useEffect(() => {
		focusNext();
	}, []);

  // TODO: big ugly function, refactor this
  const onSelect = async (item: { label: string, value: string }) => {
    const consumerGroupId = item.value;

    const adminClient = await KafkaGliClient.getAdminClient();
    const topicsList = await adminClient?.listTopics();
    const topicsListFiltered = topicsList.filter((t) => !t.startsWith('_'))
    const consumerGroupOffsets = await adminClient.fetchOffsets({ groupId: consumerGroupId, topics: topicsListFiltered })

    // unfortunately have to loop through all topics and get each offset individually
    const topicsOffsets: {[topic:string]: TopicPartition[]} = {}
    for (let topic of topicsListFiltered) {
      topicsOffsets[topic] = await adminClient.fetchTopicOffsets(topic);
    }

    const tableData: KafkaMessagesTableData[] = []

    // loop through consumer group offsets, find related topic offset, calculate the lag, and build the table data
    consumerGroupOffsets.forEach((consumerGroupOffset) => {
      const topic = consumerGroupOffset.topic;
      consumerGroupOffset.partitions.forEach((part) => {
        const topicOffset = topicsOffsets[topic]?.find(p => p.partition === part.partition)?.offset
        tableData.push({
          topic,
          groupId: consumerGroupId,
          topicOffset: topicOffset,
          groupOffset: part.offset,
          lag: parseInt(topicOffset || "") - parseInt(part.offset)
        })
      })
    })

    setGroupOffsets(tableData);

    // for now just set consume group metadata
    const groupDescription = await adminClient.describeGroups([item.value]);
    setSelectedGroupDescription(groupDescription.groups)
  }

  useEffect(() => {
    const getGroups = async () => {
      const adminClient = await KafkaGliClient.getAdminClient();
      const groupsList = await adminClient?.listGroups();
      setGroups(
        groupsList.groups.map((g) => ({ label: g.groupId, value: g.groupId }))
      );
    }

    getGroups();
  }, [])

  return (
      <Box flexDirection="column">
        <Box height="10%" width="100%">
          <GroupSelector groups={groups} onSelect={onSelect} />
        </Box>
        <Box height="90%">
          <Box width="30%">
            <GroupMetadata description={selectedGroupDescription} />
          </Box>
          <Box width="70%">
            <GroupOffsets offsets={groupOffsets} />
          </Box>
        </Box>
      </Box>
    )
}
