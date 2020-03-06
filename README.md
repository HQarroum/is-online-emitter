<br /><br /><br />
<p align="center">
  <img width="270" src="assets/icon.png" />
</p><br /><br />

# is-online-event
:zap: Receive events about gain and loss of Internet connectivity.

![Green application](https://img.shields.io/badge/green-application-brightgreen.svg)

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

> This project is based on the [`is-online`](https://github.com/sindresorhus/is-online) library and adds an event interface on top of it in order to asynchronously notify your applications of gain and loss of Internet connectivity.

## 🛠 Usage

In order to use this library you need to instantiate it, subscribe to the events you are interested in and start the connectivity montoring.

```js
const IsOnlineEmitter = require('../..');

// Creating a new instance of the emitter.
const emitter = new IsOnlineEmitter();
// Listening to `connectivity.change` events.
emitter.on('connectivity.change', console.log);
// Starting the connectivity monitoring.
emitter.start();
```

## 👀 See also

 - The [is-online](https://github.com/sindresorhus/is-online) library on which this project is based.
