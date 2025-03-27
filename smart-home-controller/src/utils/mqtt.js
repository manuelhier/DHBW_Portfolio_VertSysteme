import 'dotenv/config';
import mqtt from 'mqtt';
import logging from 'logging';

const logger = logging.default('MQTT');

const mqttSecrets = {
    url: process.env.MQTT_HOST,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
}

const mqttTopics = [
    'wwi23b3/rettig/devices',
    'wwi23b3/rettig/rooms',
    'wwi23b3/rettig/users'
]

var mqttClient = connectToBroker();

function connectToBroker() {
    return mqtt.connect(mqttSecrets.url, {
        username: mqttSecrets.username,
        password: mqttSecrets.password
    });
}

export default function configureMqttConnection() {
    try {
        if (!mqttClient.connected) {
            mqttClient = connectToBroker();
        }

        mqttClient.subscribe(mqttTopics, (error) => {
            if (error) {
                logger.error('Error while subscribing to MQTT topics:', error);
            }
        });

        mqttClient.on('error', (error) => {
            logger.error('MQTT error:', error);
        });
    } catch (error) {
        console.error('Error while connecting to MQTT broker:', error);
    }
}

class MqttService {
    constructor(topic) {
        this.mqttConnection = mqttClient;
        this.topic = topic;
    }

    publishMqttMessage(message) {
        if (!this.mqttConnection) {
            logger.error('No MQTT connection available');
            throw new Error('No MQTT connection available');
        }

        this.mqttConnection.publish(this.topic, message, {}, (error) => {
            if (error) {
                logger.error('Error while publishing MQTT message:', error);
                throw error;
            } else {
                // let msgLogger = logging.default('MQTT ' + this.topic.toUpperCase());
                // msgLogger.info(message.toString());
            }
        });
    }
}

export class DeviceMqttService extends MqttService {
    constructor() {
        super(mqttTopics[0]);
    }
}

export class RoomMqttService extends MqttService {
    constructor() {
        super(mqttTopics[1]);
    }
}

export class UserMqttService extends MqttService {
    constructor() {
        super(mqttTopics[2]);
    }
}