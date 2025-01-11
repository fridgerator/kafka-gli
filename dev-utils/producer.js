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
  const producer = kafka.producer()

  await producer.connect()

  let x = 0;

  while (true) {
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: `Hello KafkaJS user! ${++x}` },
      ],
    })
    console.log(`sent ${x}`)
    await sleep(1000)
  }
}

main()
