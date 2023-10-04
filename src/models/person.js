import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    minlenght: 5,
    maxlenght: 30,
  },
  dateBirthday: {
    type: String,
    required: true,
    unique: false,
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
    minlenght: 6,
    maxlenght: 10,
  },
  document: {
    type: String,
    required: true,
    unique: true,
    minlenght: 6,
    maxlenght: 10,
  },
});

schema.plugin(beautifyUnique);
export default mongoose.model('Person', schema);
