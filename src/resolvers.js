import Person from './models/person.js';

// Definir las peticiones
export const resolvers = {
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
    removeAll: async (root, args) => {
      return (await Person.deleteMany({})).deletedCount;
    },
  },
};
