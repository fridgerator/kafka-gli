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

  const result = await admin.fetchTopicOffsets("test-topic")
  console.log(result)
}

main()
