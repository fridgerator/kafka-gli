import React, { useEffect, useState } from 'react';
import { Box, useFocusManager } from 'ink';
import { FetchOffsetsPartition, GroupDescription } from 'kafkajs';

import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import GroupSelector from '../components/group-selector.js';
import GroupMetadata from '../components/group-metadata.js';
import GroupOffsets from '../components/group-offsets.js';

type offsets = {
  topic: string;
  partitions: FetchOffsetsPartition[];
}[]

export default function ConsumerGroups() {
  const [groups, setGroups] = useState<{ label: string, value: string }[]>([]);
  const [selectedGroupDescription, setSelectedGroupDescription] = useState<GroupDescription[] | undefined>();
  const [groupOffsets, setGroupOffsets] = useState<offsets | undefined>();
  const {focusNext} = useFocusManager();

  useEffect(() => {
		focusNext();
	}, []);

  const onSelect = async (item: { label: string, value: string }) => {
    const adminClient = await KafkaGliClient.getAdminClient();
    const groupDescription = await adminClient.describeGroups([item.value]);
    setSelectedGroupDescription(groupDescription.groups)

    // TODO: topic selector
    const topicsList = await adminClient?.listTopics();
    const offsets = await adminClient.fetchOffsets({ groupId: item.value, topics: topicsList })
    setGroupOffsets(offsets);
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
