const IsOnlineEmitter = require('../..');

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', () => {
  console.log(`Connectivity state update : ${JSON.stringify(emitter.getConnectivityState())}`);
});
// Starting the connectivity monitoring.
emitter.start();
// Trying to retrieve the connectivity state immediately (can be `unknown`).
console.log(`Initial connectivity state : ${JSON.stringify(emitter.getConnectivityState())}`);
