import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { v4 as uuid } from 'uuid';

const persons = [
  {
    id: 'ac293e21-74a2-400f-b447-0fe6bce315d0',
    name: 'Juan Pérez',
    phone: '+1234567890',
    street: 'Calle Principal 123',
    city: 'Ciudad',
    document: 123456789,
    dateBirthday: '1990-05-15',
  },
  {
    id: 'c475d08e-39dd-4a7a-b721-e197ab604683',
    name: 'María González',
    phone: '',
    document: 987654321,
    dateBirthday: '1985-10-20',
  },
  {
    id: '307b232e-95f3-4058-ac79-cb663e323935',
    name: 'Carlos Rodríguez',
    document: 456789123,
    dateBirthday: '1978-03-08',
  },
  {
    id: '1b88fa4e-0a8a-4ffb-93a6-f5fc3efbc7dc',
    name: 'Luisa Martínez',
    document: 789123456,
    dateBirthday: '2020-12-30',
  },
  {
    id: 'bbf038fe-2204-4a89-92f1-03cef14ac9b4',
    name: 'Pepe Martínez',
    document: 789144456,
    dateBirthday: '2015-12-30',
  },
];

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
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons;

      const byPhone = (person) =>
        args.phone === 'Yes' ? person.phone : !person.phone;

      return persons.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { id } = args;
      return persons.find((person) => person.id === id);
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
      const p = { ...args, id: uuid() };

      const pI = persons.findIndex(
        (person) => person.document === args.document
      );

      if (pI !== -1) {
        throw new Error('Document must be unique');
      }

      persons.push(p);
      return p;
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
    editPerson: (root, args) => {
      const { id } = args;
      const pI = persons.findIndex((person) => person.id === id);

      if (pI === -1) {
        throw new Error('Id not exist');
      }

      const p = { ...persons[pI], ...args };
      persons[pI] = p;
      return p;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);
