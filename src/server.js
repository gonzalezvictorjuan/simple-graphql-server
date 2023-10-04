import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

console.log(`🪄  Starting with the magic...`);

mongoose
  .connect('mongodb://mongo-user:123456@localhost:27017/', {
    dbName: 'DB_Persons',
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
