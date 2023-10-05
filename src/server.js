import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

dotenv.config();

console.log(`🪄  Starting with the magic...`);

const USER = process.env.MONGOOSE_DB_USER;
const PASS = process.env.MONGOOSE_DB_PASS;
const HOST = process.env.MONGOOSE_DB_HOST;
const PORT = process.env.MONGOOSE_DB_PORT;
const DB_NAME = process.env.MONGOOSE_DB_NAME;

mongoose
  .connect(`mongodb://${USER}:${PASS}@${HOST}:${PORT}/`, {
    dbName: DB_NAME,
  })
  .then(async () => {
    console.log(`🔌 Connected to MongoDB`);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server);

    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error(`❌ Error connection to MongoDB:`, error.message);
  });
