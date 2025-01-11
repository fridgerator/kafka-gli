import { Admin, Consumer, Kafka, Producer } from 'kafkajs';

export class KafkaGliClient {
  private static kafkaClient?: Kafka;
  private static admin?: Admin;
  private static producer?: Producer;
  private static consumer?: Consumer;

  static getClient = (): Kafka => {
    if (this.kafkaClient) return this.kafkaClient;

    this.kafkaClient = new Kafka({
      // TODO: get brokers from cli flags
      brokers: ["localhost:9092", "localhost:9093", "localhost:9094"],
      // TODO: Default to kafkaCli, allow override via cli flags
      clientId: "kafkaCli"
    })
    return this.kafkaClient
  }

  static getAdminClient = async (): Promise<Admin> => {
    if (this.admin) return this.admin;

    const client = this.getClient();
    this.admin = client?.admin();
    await this.admin?.connect();
    return this.admin;
  }

  static getProducerClient = async (): Promise<Producer> => {
    if (this.producer) return this.producer;

    const client = this.getClient();
    // TODO: pass producer configs
    this.producer = client?.producer();
    await this.producer?.connect();
    return this.producer;
  }

  static getConsumerClient = async (): Promise<Consumer> => {
    if (this.consumer) return this.consumer;

    const client = this.getClient();
    this.consumer = client?.consumer({
      // TODO: same group id as client?
      // TODO: pass consumer configs
      groupId: "kafkaCli"
    });
    await this.consumer?.connect();
    return this.consumer;
  }
}
