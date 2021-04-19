import http from 'http';
import logger from './startup/logger.js';
import app from './app.js';

/**
 * Create HTTP server.
 * HTTP server listen on provided port, on all network interfaces.
 */
const server = http.createServer(app);
const port = process.env.API_PORT || 3030;

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Common listener callback functions
 */
function onError(error) {
  logger.log('error', `Express failed to listen on port ${this.address().port} ...`, error.stack);
}

function onListening() {
  logger.log('info', `Express is listening on port ${this.address().port} ...`);
}
