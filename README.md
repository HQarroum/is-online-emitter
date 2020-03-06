<br /><br /><br />
<p align="center">
  <img width="270" src="assets/icon.png" />
</p><br /><br />

# is-online-event
:zap: Receive events about gain and loss of Internet connectivity.

![PR Welcome](https://img.shields.io/badge/PR-welcome-brightgreen.svg)

Current version: **1.0.0**

Lead Maintainer: [Halim Qarroum](mailto:qarroumh@amazon.lu)

## 📋 Table of contents

- [Installation](#-install)
- [Features](#-features)
- [Metrics](#-metrics)
- [Description](#-description)
- [Usage](#-usage)
- [See also](#-see-also)

## 🚀 Install

```bash
npm install is-online-event --save
```

## 🔖 Features

 - Monitors Internet connectivity notifies you of connectivity changes.
 - Monitors for changes on network interfaces to automatically trigger connectivity checks.
 - Uses fibonacci back-off to periodically check for Internet connectivity.
 - Supports Internet connectivity checks using a HTTP(S) proxy.

## 🔰 Description

This library allows developers and system administrators to be alerted upon connectivity changes to the public Internet. This can be useful if your applications is connectivity sensitive and needs to be alerted as soon as possible of a loss/gain of Internet connectivity.

This project is based on the [`is-online`](https://github.com/sindresorhus/is-online) library and adds an event interface on top of it in order to asynchronously notify your applications of gain and loss of Internet connectivity.

> Note that it can take up to 10 seconds with the default paraneters to receive a notification about an Internet connectivity change once it has effectively changed

## 🛠 Usage

In order to use this library you need to instantiate it, subscribe to the events you are interested in and start the connectivity montoring.

```js
const IsOnlineEmitter = require('is-online-emitter');

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter({});
// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Starting the connectivity monitoring.
emitter.start();
```

> See the [`examples`](./examples) directory for more information on how to use the library.

### Configuration

Different configuration variables can be passed to this library when instanciating it in order to customize its behavior. Below is a list of the defined variables associated with their description.

Variable | Type | Description
-------- | ---- | -----------
`backOffInitialDelay` | Number | The initial delay, in milliseconds, used by the used back-off strategy to trigger connectivity checks.
`backOffMaxDelay` | Number | The maximum delay, in milliseconds, used by the used back-off strategy to trigger connectivity checks.
`connectionTimeout` | Number | The connection timeout, in milliseconds, used when issuing requests to external services during the connectivity check.



## 👀 See also

 - The [is-online](https://github.com/sindresorhus/is-online) library on which this project is based.
