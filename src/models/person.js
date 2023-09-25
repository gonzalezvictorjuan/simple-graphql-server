import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    minlenght: 5,
    maxlenght: 30,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
    minlenght: 6,
    maxlenght: 10,
  },
  street: {
    type: String,
    required: false,
    unique: false,
    minlenght: 6,
    maxlenght: 30,
  },
  city: {
    type: String,
    required: false,
    unique: false,
    maxlenght: 30,
  },
  document: {
    type: String,
    required: true,
    unique: true,
    minlenght: 7,
  },
  dateBirthday: {
    type: String,
    required: true,
  },
});

schema.plugin(mongooseUniqueValidator);

//hay un monton de plugins para validar
export default mongoose.model('Person', schema)