import EventEmitter from 'events';
import isOnline from 'is-online';
import backoff from 'backoff';
import ni from '@leichtgewicht/network-interfaces';

// The current connectivity information object.
let connectivityInfo = {};

/**
 * Performs the Internet connectivity check and updates
 * the connectivity information. This function will also
 * trigger events if the connectivity changed.
 * @returns a promise that resolves to a boolean value
 * indicating the current Internet connectivity state.
 */
const checkConnectivity = function () {
  const timeout = !isNaN(parseInt(this.opts.connectionTimeout)) ?
    parseInt(this.opts.connectionTimeout) : 10000;

  return (isOnline({ timeout }).then((online) => {
    if (online !== connectivityInfo.status) {
      // There was a connectivity change.
      connectivityInfo.status = online;
      connectivityInfo.updatedAt = new Date().toISOString();
      this.emit('connectivity.change', connectivityInfo);
    }
    return (online);
  }));
};

/**
 * The `IsOnlineEmitter` class is responsible for monitoring
 * the Internet connectivity state and to notify its users of
 * any changes.
 */
class IsOnlineEmitter extends EventEmitter {

  /**
   * `IsOnlineEmitter` constructor.
   * @param opts an object holding the configuration
   * of the `IsOnlineEmitter` class.
   */
  constructor(opts) {
    super();
    this.opts = opts || {};
    // The back-off strategy initial delay.
    this.initialDelay = !isNaN(parseInt(this.opts.backOffInitialDelay)) ?
      parseInt(this.opts.backOffInitialDelay) : 5000;

    // The back-off strategy maximum delay.
    this.maxDelay = !isNaN(parseInt(this.opts.backOffMaxDelay)) ?
      parseInt(this.opts.backOffMaxDelay) : 60000;

    // Creating and configuring the fibonacci
    // backoff strategy.
    this.fibonacciBackoff = backoff.fibonacci({
      initialDelay: this.initialDelay,
      maxDelay: this.maxDelay
    });

    this.checkConnectivity = checkConnectivity.bind(this);

    // Emitted when a backoff operation is done.
    // Signals that the connectivity check operation should be done.
    this.onReady = () => {
      // Executing the connectivity check.
      this.checkConnectivity().then(() => {
        try {
          // Scheduling a connectivity check.
          this.fibonacciBackoff.backoff();
        } catch (e) {
          this.emit('warning', e);
        }
      });
    };

    // Notifies changes made to network interfaces in order
    // to trigger Internet connectivity checks.
    this.onNetworkInterfacesChange = (e) => {
      this.reset();
      this.emit('network.interface.change', e);
    };
    
    // Emitted when a backoff operation is started.
    // Signals to the client how long the next backoff delay will be.
    this.onBackoff = (_, delay) => this.emit('connectivity.check.scheduled', delay);
  }

  /**
   * @return the current connectivity information object
   * if available or an unknown value if the connectivity
   * information haven't yet been retrieved.
   */
  getConnectivityState() {
    return (typeof connectivityInfo.status === 'undefined' ?
      { status: 'unknown' } : connectivityInfo);
  }

  /**
   * Starts the connectivity monitoring.
   */
  start() {
    this.checkConnectivity().then(() => {
      try {
        // Subscribing to back-off events.
        this.fibonacciBackoff.on('backoff', this.onBackoff);
        // Subscribing to ready events.
        this.fibonacciBackoff.on('ready', this.onReady);
        // Subscribing to network interface change events.
        ni.networkInterfaces.on('change', this.onNetworkInterfacesChange);
        // Scheduling a connectivity check.
        this.fibonacciBackoff.backoff();
      } catch (e) {
        this.emit('warning', e);
      }
    });
  }

  /**
   * Stops the connectivity monitoring.
   */
  stop() {
    // Un-subscribing from back-off events.
    this.fibonacciBackoff.removeListener('backoff', this.onBackoff);
    // Un-subscribing from ready events.
    this.fibonacciBackoff.removeListener('ready', this.onReady);
    // Un-subscribing from network interface change events.
    ni.networkInterfaces.removeListener('change', this.onNetworkInterfacesChange);
    // Stopping the back-off timer.
    this.fibonacciBackoff.reset();
    // Reset the `connectivityInfo`.
    connectivityInfo = {};
  }

  /**
   * Resets the internal fibonacci back-off timer to the
   * original `backOffInitialDelay` value.
   */
  reset() {
    try {
      // Resetting the timer.
      this.fibonacciBackoff.reset();
      // Scheduling a connectivity check.
      this.fibonacciBackoff.backoff();
    } catch (e) {
      this.emit('warning', e);
    }
  }
}

export default IsOnlineEmitter;
