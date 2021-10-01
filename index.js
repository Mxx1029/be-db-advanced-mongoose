import mongoose from 'mongoose';
import faker from 'faker';
import Pet from './models/pet.js';
import User from './models/user.js';

// we need a user to exist in the target database so we can connect
// $ mongo
// > use exampledb
// > db.createUser({user: "jimmy", pwd: "passw0rd", roles: ["readWrite"]})

const username = "jimmy";
const password = "passw0rd";
const db = "exampledb";

// defines exactly how to connect 
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
    // console.log("Connected, ready for inserting Rauli :D");

    // create a new pet for insertion
    // const rauli = new Pet({ name: "Rauli", age: 99 });
    // these are Model.prototype.methods() (= all who have the .prototype. will be applicable to all Pet instances)
    // inserting an object based on a model with .save() is asynchronous!
    // rauli.save()
    //     .then(() => console.log("Rauli saved!"))
    //     .catch(e => console.log("Unable to save Rauli!!!", e))
        // .finally(() => mongoose.connection.close());
    // you need to keep the connection open if you're inserting more than just Rauli here

    // ----------
    // Insert Testuser to database

    // const testUser = new User({
    //     username: "CoolZero",
    //     password: "minusthree",
    //     age: 16,
    //     role: "Admin"
    // });

    // testUser.save()
    //     .then(() => console.log("Testuser saved!"))
    //     .catch(e => console.log("Unable to save Testuser!!!", e))
    //     .finally(() => mongoose.connection.close());

    // ----------
    // Specific user methods
    
    // console.log("CoolZero can edit ?", testUser.canEdit());

    // testUser.buyBeer();
    
    // ----------
    // Static (general) methods on user

    // const user = await User.findByName("CoolZero");
    // if you put a breakpoint at the next line, it would show you, that user is a query... so you need the await here and the .exec() in user.js
    // console.log(user.username, user.role, user.age, "CanEdit ?", user.canEdit());
    // the last one (user.canEdit()) uses a specific method on the general static user, that is used to find an instance

    // const admins = await User.findAdmins();
    // admins.forEach((admin) => console.log(admin.username, admin.age))

    // ----------
    // Work with seeding (npm package Faker.js)

    // Purge (delete) ALL old users
    await User.deleteMany({}).exec();
    
    // Create fake users
    const fakes = [];
    for (let i = 50; i > 0; i--) {
        fakes.push({
            username: faker.internet.userName(),
            password: faker.internet.password(),
            age: faker.datatype.number(99), // one number means the maximum and 0 is the default 
            // if you want a range, use ({"min": 14, "max": 99})
            role: "User",
            email: faker.internet.email(),
            referenceCode: Math.random() * 99999 + "",
            address: {
                street: "Some Street here",
                postal: "90210",
                country: "India"
            },
            skills: [
                { name: "JavaScript", level: 9 },
                { name: "git", level: 3 },
                { name: "CSS", level: 7 },
            ]
        });
    };

    // returns a Promise, so we use await, that the mongoose connection will only close after the creation of the fake users
    // use fake user objects to create data into Mongo
    // should be Model.create() in documentation
    await User.create(fakes);

    // Create custom admin user
    const adminUser = new User({
        username: "Artholomew",
        password: "passw0rd",
        age: 99,
        role: "Admin",
        email: `admin${Math.round(Math.random() * 22222)}@email.org`,
        referenceCode: Math.random() * 99999 + ""
    })

    // should be Model.prototype.save() in documentation
    await adminUser.save()
        .then(() => console.log("admin saved"))
        .catch((e) => console.log("couldn't save admin", e))

    // now you can run methods on our admin user
    await adminUser.buyBeer();

    // we can also run static User methods
    const queryResult = await User.findByName("Artholomew");
    
    console.log(queryResult);
    
} catch (e) {
    console.log("Eeeeeeerror", e)
} finally {
    // don't forget to close the connection
    mongoose.connection.close();
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
