// import { KafkaGliClient } from '../src/utils/kafka-gli-client'
import { Kafka } from 'kafkajs';

const client = new Kafka({
  // TODO: get brokers from cli flags
  brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
  // TODO: Default to kafkaCli, allow override via cli flags
  clientId: "my-app"
})
const admin = client.admin();

const consumerClient = client.consumer({
// TODO: same group id as client?
// TODO: pass consumer configs
  groupId: "newone",
  // retry: {
  //   restartOnFailure: (e) => {
  //     return Promise.resolve(true)
  //   }
  // }
});

const go = async () => {
  await consumerClient.connect()

  await admin.resetOffsets({ topic: 'test-topic', groupId: 'newone', earliest: true })

  await consumerClient?.subscribe({ topics: ["test-topic"] })
  consumerClient?.run({
    eachMessage: async (msg) => {
      console.log('msg')
    }
  })
}

const gracefulShutdown = async () => {
  await admin.disconnect();
  await consumerClient.disconnect();
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

go()
