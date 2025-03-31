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

    _publishMqttMessage(url, method, data, description) {
        if (!this.mqttConnection) {
            logger.error('No MQTT connection available');
            throw new Error('No MQTT connection available');
        }

        const message = {
            url,
            method,
            data,
            description
        }

        this.mqttConnection.publish(this.topic, JSON.stringify(message, null, '\t'), {}, (error) => {
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

    notify(deviceId = null, method = null, data = null, description = null) {
        const url = `/api/v1/devices/${deviceId}`;
        this._publishMqttMessage(url, method, data, description);
    }

}

export class RoomMqttService extends MqttService {
    constructor() {
        super(mqttTopics[1]);
    }

    notify(roomId = null, method = null, data = null, description = null) {
        const url = `/api/v1/rooms/${roomId}`;
        this._publishMqttMessage(url, method, data, description);
    }

}

export class UserMqttService extends MqttService {
    constructor() {
        super(mqttTopics[2]);
    }

    notify(userId = null, method = null, data = null, description = null) {
        const url = `/api/v1/users/${userId}`;
        this._publishMqttMessage(url, method, data, description);
    }
}