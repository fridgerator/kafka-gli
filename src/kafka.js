import { Kafka } from 'kafka-js'

export const listTopics = async () => {
  const kafka = new Kafka({
    brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
    clientId: "kafkaCli"
  })
  const admin = kafka.admin();
  await admin.connect();
  const topics = await admin.listTopics();
  return topics;
}