const target = process.env.TARGET;

if(!target) {
    console.error('Please set target enviroment variable ');
    process.exit();
}

const Docker = require('dockerode');
const DockerEvents = require('docker-events');
const axios = require('axios');

var emitter = new DockerEvents({
    docker: new Docker({socketPath: '/var/run/docker.sock'})
});

emitter.start();

emitter.on('connect',() => console.log('-- Connected to docker API'));
emitter.on("disconnect", () => console.log("-- Disconnected to docker api; reconnecting"));

emitter.on("_message", (message) => dispatch(message,target));

function dispatch(msg,target,method="POST") {

    axios({
        method: method,
        url: target,
        data: JSON.stringify(msg),
        timeout: 10000,
    })
    .then()
    .catch(e => {
        console.error('Error while seding data to webhook '+target+" ["+msg.Type+" => "+msg.status+"]");
    });
}
