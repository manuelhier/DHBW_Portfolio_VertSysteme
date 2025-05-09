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

let mqttClient = connectToBroker();

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

        mqttClient.on('connect', () => {
            logger.info('Connected to MQTT broker');
        });

        mqttClient.on('error', (error) => {
            logger.error('MQTT error:', error);
        });

        mqttClient.on('message', (topic, message) => {
            let msgLogger =  logging.default('MQTT ' + topic.toUpperCase());
            msgLogger.info(`Neue Änderung in '${topic.split('/', ).at(2).toLocaleUpperCase()}' eingegangen : ${message.toString()}`);
        });

        process.on('SIGINT', () => {
            mqttClient.end(() => {
                console.log('MQTT client disconnected');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error('Error while connecting to MQTT broker:', error);
    }
}