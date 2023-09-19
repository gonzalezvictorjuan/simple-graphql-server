import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const persons = [
  {
    id: '1',
    name: 'Juan Pérez',
    phone: '+1234567890',
    street: 'Calle Principal 123',
    city: 'Ciudad',
    document: 123456789,
    dateBirthday: '1990-05-15',
  },
  {
    id: '2',
    name: 'María González',
    document: 987654321,
    dateBirthday: '1985-10-20',
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    document: 456789123,
    dateBirthday: '1978-03-08',
  },
  {
    id: '4',
    name: 'Luisa Martínez',
    document: 789123456,
    dateBirthday: '2020-12-30',
  },
  {
    id: '5',
    name: 'Pepe Martínez',
    document: 789144456,
    dateBirthday: '2015-12-30',
  },
  {
    id: '6',
    name: 'Maria Martínez',
    document: 647238291,
    dateBirthday: '2015-12-30',
  },
];

// Definir los datos
const typeDefs = gql`
  type Person {
    id: String
    name: String!
    phone: String
    street: String
    city: String
    document: Int!
    dateBirthday: String
    canDrink: Boolean
    age: Int
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(id: String!): Person
  }
`;

// Definir las peticiones
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);
