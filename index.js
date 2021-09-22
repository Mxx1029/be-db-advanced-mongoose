import mongoose from 'mongoose';
import Pet from './models/pet.js';

// we need a user to exist in the target database so we can connect
// $ mongo
// > use exampledb
// > db.createUser({user: "jimmy", pwd: "passw0rd", roles: ["readWrite"]})

const username = "jimmy";
const password = "passw0rd";
const db = "exampledb";

const connectionString = `mongodb://${username}:${password}@localhost:27017/${db}`;

// Method 1 to connect w/ a user
// ---------
mongoose.connection.on('error', 
    (e) => console.log(">> Error!", e)) 
        || process.exit(0) 
mongoose.connection.on('connecting', 
    () => console.log(">> Connecting"));
mongoose.connection.on('disconnecting', 
    () => console.log(">> Disconnecting"));
mongoose.connection.on('disconnected', 
    () => console.log(">> Disconnected"));

// if you have these 3 event handlers above, you don't need the .then() and .catch() further down 
// and also not the startProgramwithMongoConnected() function to make sure you're code is only running when the connection to MongoDB stands (...?)

try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(connectionString);
    
    // if we got this far, the connection was successful
    console.log("Connected, ready for inserting Rauli :D");

    // create a new pet for insertion
    const rauli = new Pet({ name: "Rauli", age: 99 });
    // these are Model.prototype.methods() (= all who have the .prototype. will be applicable to all Pet instances)
    // inserting an object based on a model with .save() is asynchronous!
    rauli.save()
        .then(() => console.log("Rauli saved!"))
        .catch(e => console.log("Unable to save Rauli!!!", e))
        .finally(() => mongoose.connection.close());
} catch (e) {
    console.log("Eeeeeeerror", e)
}


// // Method 2 to connect w/ a user
// -------------
// // put your program into a function that only starts after MongoDB is connected
// const startProgramWithMongoIsConnected = () => {
//     console.log(123);
// }

// mongoose
//     .connect(connectionString)
//     .then(() => {
//         console.log("connected!");
//         startProgramWithMongoIsConnected();
//     })
//     .catch(e => {
//         console.log("error when connecting", e);
//         process.exit(0);
//     })

// -----------
// Connect to database (works for me, if there's no user set up)
// const connectionString = 'mongodb://localhost:27017/test';
// if you have no user, that's how you connect and handle errors: 
// mongoose.connection.on('error', (e) => { console.log("Error: ", e); })
// mongoose.connect(connectionString, () => { console.log("Mongoose connected"); })
    
// -----------
// first try of Joel, when everything was very confusing...
// this section is for access w/ a specific user :

// this didn't work, because a user created in admin database doesn't have automatically access to the test database:
// const connectionString = `mongodb://${username}:${password}@localhost:27017/test`;

// this works, when your user exists in another database than the one you want them connect to --> but it is complicated:
// https://mongoosejs.com/docs/connections.html#callback
// try {
//     await mongoose.connect('mongodb://localhost:27017/test', {
//         auth: { username: username, password: password },
//         authSource: "admin",
//     });
//     console.log("Connected to mongo db");
// } catch (err) {
//     console.error("Error connecting to mongodb", err);
// } 
// the following finally is not necessary
// finally {
//     console.log("Finished connecting")
// }
