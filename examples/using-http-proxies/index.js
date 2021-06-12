import IsOnlineEmitter from '../../index.js';
import { bootstrap } from 'global-agent';
import './proxy/index.js';

bootstrap();

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();

// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Starting the connectivity monitoring.
emitter.start();
