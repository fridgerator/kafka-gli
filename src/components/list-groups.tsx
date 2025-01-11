import React, { useEffect, useState } from 'react';
import SelectInput from 'ink-select-input';
import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import { Box, Text } from 'ink';
import { FetchOffsetsPartition, GroupDescription } from 'kafkajs';

type offsets = {
  topic: string;
  partitions: FetchOffsetsPartition[];
}[]

export default function ListGroups() {
  const [groups, setGroups] = useState<{label: string, value: string}[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupDescription[] | undefined>();
  const [groupOffsets, setGroupOffsets] = useState<offsets | undefined>();

  const onSelect = async (item: {label: string, value: string}) => {
    const adminClient = await KafkaGliClient.getAdminClient();
    const groupDescription = await adminClient.describeGroups([item.value]);
    setSelectedGroup(groupDescription.groups)

    const topicsList = await adminClient?.listTopics();
    const offsets = await adminClient.fetchOffsets({ groupId: item.value, topics: topicsList })
    setGroupOffsets(offsets);
  }

  useEffect(() => {
    const getGroups = async () => {
      const adminClient = await KafkaGliClient.getAdminClient();
      const groupsList = await adminClient?.listGroups();
      setGroups(
        groupsList.groups.map((g) => ({label: g.groupId, value: g.groupId}))
      );
    }

    getGroups();
  }, [])

  const renderGroupDescription = () => {
    if (!selectedGroup) return <Text>Select a group</Text>
    return JSON.stringify(selectedGroup, null, 2)
  }

  const renderGroupOffsets = () => {
    if (!groupOffsets) return <></>
    return JSON.stringify(groupOffsets, null, 2);
  }

  return (
    <Box flexDirection="column">
      <Box height="10%">
        <Box borderStyle={"single"} width="100%">
          <SelectInput items={groups} onSelect={onSelect} />
        </Box>
      </Box>
      <Box height="90%">
        <Box borderStyle={"single"} width="30%" overflowY="hidden">
          <Text>{renderGroupDescription()}</Text>
        </Box>
        <Box borderStyle={"single"} width="70%" overflowY="hidden">
          <Text>{renderGroupOffsets()}</Text>
        </Box>
      </Box>
    </Box>
  )
}
