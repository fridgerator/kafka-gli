import { Kafka } from 'kafkajs'
import { faker } from '@faker-js/faker';

const kafka = new Kafka({
  clientId: "kafkaCli",
  brokers: ["localhost:9092", "localhost:9093", "localhost:9094"]
})
const producer = kafka.producer()

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const getData = () => {
  return {
    "data": [{
      "type": faker.word.words(),
      "id": faker.number.int(),
      "attributes": {
        "title": faker.book.title(),
        "author": faker.book.author(),
        "created": faker.date.anytime(),
        "updated": faker.date.anytime()
      },
      "relationships": {
        "author": {
          "data": {"id": "42", "type": "people"}
        }
      }
    }],
    "included": [
      {
        "type": "people",
        "id": faker.number.int(),
        "attributes": {
          "name": faker.person.firstName(),
          "age": faker.number.int(10, 70),
          "gender": faker.person.gender()
        }
      }
    ]
  }
}

const main = async () => {
  await producer.connect()
  await sleep(2000)

  let x = 0;

  while (x < 20) {
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: JSON.stringify(getData()) },
      ],
    })
    console.log(`sent ${++x}`)
    await sleep(500)
  }

  await producer.disconnect();
}

const gracefulShutdown = async () => {
  await producer.disconnect();
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

main()
