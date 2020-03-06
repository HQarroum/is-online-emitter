const EventEmitter          = require('events').EventEmitter;
const isOnline              = require('is-online');
const backoff               = require('backoff');
const { networkInterfaces } = require('@leichtgewicht/network-interfaces');

// The current connectivity information object.
const connectivityInfo = {};

// Bootstrap the global proxy agent.
require('./lib/proxy');
require('global-agent/bootstrap');

/**
 * Performs the Internet connectivity check and updates
 * the connectivity information. This function will also
 * trigger events if the connectivity changed.
 */
const checkConnectivity = function () {
  const timeout = !isNaN(parseInt(this.opts.connectionTimeout)) ?
    parseInt(this.opts.connectionTimeout) : 10000;

  return (isOnline({ timeout }).then((online) => {
    if (online !== connectivityInfo.status) {
      // There was a connectivity change.
      connectivityInfo.status = online;
      // Adding the last check date.
      connectivityInfo.updatedAt = new Date().toISOString();
      // Signaling the connectivity change.
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
    //  Creating and configuring the fibonacci
    // backoff strategy.
    this.fibonacciBackoff = backoff.fibonacci({
      randomisationFactor: 0,
      initialDelay: !isNaN(parseInt(this.opts.backOffInitialDelay)) ?
        parseInt(this.opts.backOffInitialDelay) : 5000,
      maxDelay: !isNaN(parseInt(this.opts.backOffMaxDelay)) ?
        parseInt(this.opts.backOffMaxDelay) : 60000
    });
    // Referencing the `checkConnectivity` function.
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
      try {
        // Re-setting the backoff delay.
        this.fibonacciBackoff.reset();
        // Scheduling a connectivity check.
        this.fibonacciBackoff.backoff();
      } catch (e) {
        this.emit('warning', e);
      }
    };
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
        this.fibonacciBackoff.on('ready', this.onReady);
        // Subscribing to network interface change events.
        networkInterfaces.on('change', this.onNetworkInterfacesChange);
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
    // Un-subscribing to back-off events.
    this.fibonacciBackoff.off('ready', this.onReady);
    // Un-subscribing to network interface change events.
    networkInterfaces.off('change', this.onNetworkInterfacesChange);
    // Stopping the back-off process.
    this.fibonacciBackoff.abort();
  }
}

module.exports = IsOnlineEmitter;