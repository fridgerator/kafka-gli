import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: "kafkaCli",
  brokers: ["localhost:9092", "localhost:9093", "localhost:9094"]
})

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const main = async () => {
  const admin = kafka.admin()

  await admin.connect()

  // 1. get offsets from all topics
  const topic = 'test-topic';
  // let topicOffsets = {
  //   [topic]: [
  //     {
  //       "partition": 0,
  //       "offset": "2568",
  //       "high": "2568",
  //       "low": "0"
  //     }
  //   ]
  // }
  const topicsList = await admin?.listTopics();
  const topicOffsets = await admin.fetchTopicOffsets(topic)
  console.log('topicOffsets ', JSON.stringify(topicOffsets, null, 2))

  
  const groupOffsets = await admin.fetchOffsets({ groupId: 'kafkaCli', topics: topicsList.filter((t) => !t.startsWith('_')) })
  console.log('groupOffsets : ', JSON.stringify(groupOffsets, null, 2))
  groupOffsets.forEach((groupOffset) => {
    let topic = groupOffset.topic;
    groupOffset.partitions.forEach((part) => {
      let partition = part.partition
      const o = topicOffsets[topic].find((t) => t.partition === partition);
      const lag = parseInt(o.offset) - parseInt(part.offset)
      console.log(topic, ', ', partition, ', ', lag)
    })
  })
}

main()
