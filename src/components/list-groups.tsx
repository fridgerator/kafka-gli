import React, { useEffect, useState } from 'react';
import SelectInput from 'ink-select-input';
import { KafkaGliClient } from '../utils/kafka-gli-client.js';
import { Box, Text, useFocus, useFocusManager } from 'ink';
import { FetchOffsetsPartition, GroupDescription } from 'kafkajs';
import Scrollable from './scrollable.js';

type offsets = {
  topic: string;
  partitions: FetchOffsetsPartition[];
}[]

interface GroupSelectorProps {
  groups: { label: string, value: string }[]
  onSelect: any
}
const GroupSelector = (props: GroupSelectorProps) => {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"}>
    <SelectInput items={props.groups} onSelect={props.onSelect} isFocused={isFocused} />
  </Box>
}

const GroupDescription = (props: {description: any}) => {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      <Text>{JSON.stringify(props.description, null, 2)}</Text>
    </Scrollable>
  </Box>
}

const GroupOffsets = (props: {offsets: any}) => {
  const { isFocused } = useFocus();

  return <Box borderStyle="round" width="100%" borderColor={isFocused ? "blue" : "white"} overflow='hidden'>
    <Scrollable isFocused={isFocused}>
      <Text>{JSON.stringify(props.offsets, null, 2)}</Text>
    </Scrollable>
  </Box>
}

export default function ListGroups() {
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
          <GroupDescription description={selectedGroupDescription} />
        </Box>
        <Box width="70%">
          <GroupOffsets offsets={groupOffsets} />
        </Box>
      </Box>
    </Box>
  )
}
