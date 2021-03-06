import mongoose from 'mongoose';
import Promise from 'bluebird';
import logger from 'lib/logger';
import defaultTo from 'lodash/defaultTo';

mongoose.Promise = Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const poolSize = defaultTo(Number(process.env.MONGO_CONNECTION_POOLSIZE), 20);
// Default timeout to 5 minutes
const socketTimeoutMS = defaultTo(Number(process.env.MONGO_SOCKET_TIMEOUT_MS), 300000);

const createConnection = () => {
  const dbpath = process.env.MONGODB_PATH;
  const serverOptions = {
    socketTimeoutMS,
    poolSize
  };

  logger.silly('Creating Mongo connection', dbpath, serverOptions);
  return mongoose.createConnection(dbpath, {
    promiseLibrary: Promise,
    ...serverOptions
  });
};

const connections = {};
const getConnections = () => connections;

const getConnection = (namespace = 'll') => {
  if (connections[namespace]) return connections[namespace];
  connections[namespace] = createConnection();
  connections[namespace].on('error', console.error);
  return connections[namespace];
};

export {
  getConnection,
  getConnections
};
