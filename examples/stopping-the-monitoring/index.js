import IsOnlineEmitter from '../../index.js';

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Starting the connectivity monitoring.
emitter.start();
// After 10 seconds, we interrupt the emitter.
setTimeout(() => {
  console.log('Stopping the emitter ...');
  emitter.stop();
}, 10 * 1000);