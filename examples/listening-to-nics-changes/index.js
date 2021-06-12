import IsOnlineEmitter from '../../index.js';

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Listening to `network.interface.change` events.
emitter.on('network.interface.change', console.log);
// Starting the connectivity monitoring.
emitter.start();