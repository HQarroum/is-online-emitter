const IsOnlineEmitter = require('../..');

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter({
  backOffInitialDelay: 5 * 1000,
  backOffMaxDelay: 60 * 1000,
  connectionTimeout: 5 * 1000
});

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);

// Starting the connectivity monitoring.
emitter.start();