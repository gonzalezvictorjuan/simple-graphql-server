import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import Person from './models/person';


// Definir los datos
const typeDefs = gql`
  enum YesNo {
    Yes
    No
  }
  type Person {
    id: String
    name: String!
    phone: String
    street: String
    city: String
    document: Int
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
      document: Int!
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
    allPersons: (root, args) => {
			return Person.find({phone: {$exists: args.phone === 'YES'}})
    },
    findPerson: (root, args) => {
      const { id } = args;
      return Person.findOne({ id });
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
			const person = new Person({...args})

			return person.save()
    },
    deletePerson: (root, args) => {
      const { id } = args;
      const pI = persons.findIndex((person) => person.id === id);

      if (pI > -1) {
        persons.splice(pI, 1);
        return true;
      }

      return false;
    },
    editPerson: async (root, args) => {
			const person = await Person.findOne({ id: args.id })
			if (!person) return 
			return person
    },
  },
};

const MONGODB_URI = `mongodb://mongo-user:123456@localhost:27017`;
await mongoose
  .connect(MONGODB_URI, {
    dbName: 'DB_Persons',
  })
  .then(async () => {
    console.log(`🔌 Connected to DB`);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await startStandaloneServer(server);

    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error(`❌ error connection to DB`, error.message);
  });
