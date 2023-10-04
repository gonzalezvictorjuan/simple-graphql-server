import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import Person from './models/person.js';

// Definir los datos
const typeDefs = gql`
  enum YesNo {
    Yes
    No
  }
  type Person {
    _id: String
    name: String!
    phone: String
    street: String
    city: String
    document: String!
    dateBirthday: String!
    canDrink: Boolean
    age: Int
  }
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(id: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String
      city: String
      document: String!
      dateBirthday: String!
    ): Person
    deletePerson(id: String!): Boolean
    editPerson(
      id: String!
      name: String
      phone: String
      street: String
      city: String
      document: Int
      dateBirthday: String
    ): Person
  }
`;

// Definir las peticiones
const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      return await Person.find({});
    },
    findPerson: async (root, args) => {
      const { id } = args;
      return await Person.findOne({ _id: id });
    },
  },
  Person: {
    canDrink: (root) => {
      const aux = new Date(root.dateBirthday);
      const today = new Date();
      const age = today.getFullYear() - aux.getFullYear();

      return age > 18;
    },
    age: (root) =>
      new Date().getFullYear() - new Date(root.dateBirthday).getFullYear(),
  },
  Mutation: {
    addPerson: (root, args) => {
      const p = new Person({ ...args });
      return p.save();
    },
    deletePerson: async (root, args) => {
      const { id } = args;
      return !!(await Person.findByIdAndDelete({ _id: id }));
    },
    editPerson: async (root, args) => {
      const { id } = args;

      return await Person.findOneAndUpdate(
        { _id: id },
        { ...args },
        {
          returnOriginal: false,
        }
      );
    },
  },
};

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
