import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    _id: false,
    street: String,
    postal: String,
    country: String
});

const skillsSchema = new mongoose.Schema({
    _id: false,
    // unique throws an error for some reason (sometimes, it worked for a while, might be a bug -- if you drop the collection and start again, it works again)
    name: { type: String, required: true, unique: true },
    level: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: { type: Number, required: true },
    // DOB: Number, // most likely a timestamp
    role: { type: String, required: true, default: "User" },
    email: { type: String, required: true, unique: true },
    referenceCode: { type: String, unique: true },
    // this creates a subdocument into a document
    // you can all put it into one Schema or create several and reference them
    // address: new mongoose.Schema({
    //     _id: false,
    //     street: String,
    //     postal: String,
    //     country: String
    // }),
    address: addressSchema,
    // skills: [ new mongoose.Schema({
    //     _id: false,
    //     name: { type: String, required: true, unique: true },
    //     level: { type: Number, default: 0 }
    // }) ]
    skills: [ skillsSchema ]
});

// javascript timestamp = amount of milliseconds passed at a given time since jan 1. 1970
// unix timestamp = amount of seconds passed at a given time since jan 1. 1970

// Our user methods
userSchema.methods.canEdit = function() {
    // function will return true, if role is Admin or Editor
    return this.role === "Admin" || this.role === "Editor"
};

userSchema.methods.buyBeer = function() {
    if (this.age < 18) {
        console.log("No beer for you, minor!");
        return;
    }
    console.log("Go ahead and by yourself a beer.")
}

// Our user static methods
// you need .exec() to execute the query and return data
userSchema.statics.findByName = function(username) {
    return this.findOne({ username }).exec();
}

userSchema.statics.findAdmins = function() {
    return this.find({ role: "Admin" }).exec();
}

const User = mongoose.model("testusers", userSchema);

export default User;