'use strict';

/**
 * @param {object} socket duplex stream
 *
 * @class Client
 */
class Client {
  constructor(socket) {
    this.socket = socket;
    this.address = socket.remoteAddress;
    this.port = socket.remotePort;
    this.name = `${this.address}:${this.port}`;
  }

  receiveMessage(message) {
    this.socket.write(message);
    this.socket.pipe(this.socket);
  }

  isLocalHost() {
    return this.address === 'localhost';
  }
}

module.exports = Client;