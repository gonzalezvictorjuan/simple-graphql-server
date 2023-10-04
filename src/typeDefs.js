import gql from 'graphql-tag';

// Definir los datos
export const typeDefs = gql`
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
    removeAll: Int
  }
`;
