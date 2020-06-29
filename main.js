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

emitter.on('connect',function() {
    console.log('-- Connected to docker API');
});

emitter.on("disconnect", function() {
    console.log("-- Disconnected to docker api; reconnecting");
});

emitter.on("_message", function(message) {
    dispatch(message,target);
});

emitter.on("create", function(message) {
    console.log("container created: %j", message);
    dispatch(message,target);
});

emitter.on("start", function(message) {
    console.log("container started: %j", message);
    dispatch(message,target);
});

emitter.on("stop", function(message) {
    console.log("container stopped: %j", message);
    dispatch(message,target);
});

emitter.on("die", function(message) {
    console.log("container died: %j", message);
    dispatch(message,target);
});

emitter.on("destroy", function(message) {
    console.log("container destroyed: %j", message);
    dispatch(message,target);
});

function dispatch(msg,target,method="POST") {

    axios({
        method: method,
        url: target,
        data: JSON.stringify(msg)
    })
    .then((_) => console.log('Message send OK'))
    .catch(e => console.error(`Error while sending message to ${target} `,e))

}