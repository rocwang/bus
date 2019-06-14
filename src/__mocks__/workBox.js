const EventEmitter = require("events");

const workboxEmitter = new EventEmitter();

module.exports = {
  workBox: {
    addEventListener: jest.fn((event, fn) => workboxEmitter.on(event, fn)),
    messageSW: jest.fn()
  },
  workboxEmitter
};
