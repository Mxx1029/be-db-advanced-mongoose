import mongoose from 'mongoose';

// First let's create a pet schema
const petSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// Second, we will create a Model based on this petSchema
// mongoose.model() returns a class, 1st argument defines which collection to use (create?), 2nd argument gives the Schema to use 
const petCollection = "pets";
const Pet = mongoose.model(petCollection, petSchema);

export default Pet;