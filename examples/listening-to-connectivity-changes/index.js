import IsOnlineEmitter from '../../index.js';

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Starting the connectivity monitoring.
emitter.start();
