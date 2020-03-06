const IsOnlineEmitter = require('../..');

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Listening to `connectivity.check.scheduled` events.
emitter.on('connectivity.check.scheduled', (delay) => {
  console.log(`Next Internet connectivity event is scheduled in '${delay}ms'.`);
});
// Starting the connectivity monitoring.
emitter.start();
