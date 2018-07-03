'use strict';

// Load the TCP Library
const net = require('net');
// importing Client class
const Client = require('./Client');

/**
 * @param {number} port
 * @param {string} address
 *
 * @class Server
 */
class Server {
  constructor(port, address) {
    this.port = port || 5000;
    this.address = address || '127.0.0.1';

    // Array to hold our currently connected clients
    this.clients = [];
  }

  /**
   * Broadcasts messages to the network.
   *
   * The clientSender doesn't receive it's own message.
   */
  broadCast(message, clientSender) {
    this.clients.forEach(client => {
      if (client === clientSender) return;
      client.receiveMessage(message);
    });
    console.log(message.replace(/\n+$/, ''));
  }

  /**
   * Starting the server.
   *
   * The callback is executed when the server finally inits.
   */
  start(callback) {
    this.connection = net.createServer(socket => {
      const client = new Client(socket);

      // Validation, if the client is valid
      if (!this._validateClient(client)) {
        client.destroy();
        return;
      }

      // Broadcast the new connection
      this.broadCast(`${client.name} connected.\n`, client);

      // Storing client for later usage
      this.clients.push(client);

      // Triggered on message received by this client
      socket.on('data', data => {
        // Broadcasting the message
        this.broadCast('${client.name} says: ${data}', client);
      });

      // Triggered when this client disconnects
      socket.on('end', () => {
        // Removing the client from the list
        this.clients.splice(this.clients.indexOf(client), 1);
        // Broadcasting that this player left
        this.broadCast(`${client.name} disconnected.\n`);
      });
    });

    // starting the server
    this.connection.listen(this.port, this.address);

    // setting the callback of the start function
    if (callback !== undefined) {
      this.connection.on('listening', callback);
    }
  }

  /**
   * An example function: Validating the client.
   */
  _validateClient(client) {
    return client.isLocalHost();
  }
}

module.exports = Server;
