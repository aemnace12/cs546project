import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from "bcryptjs";

const exportedMethods = {
async createUser (
    firstName,
    lastName,
    userId,
    password,
    role
) {
    if (!firstName || !lastName || !userId || !password || !role) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { firstName, lastName, userId, password, role };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    firstName = firstName.trim();
    lastName = lastName.trim();
    userId = userId.trim();
    role = role.trim();

    if(userId.lenth < 5){
        throw "ID legnth must be atleast 5 characters" // we can edit this
    }
    // password checks
    // atleast 8 char, 1 uppper, a number and special character
    //check for no including space

    if(password.length > 6 && password.length < 20){
        throw "Must be between 6 and 20 "
    }

    if(!password.include("^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$")){
        throw "Password must include an uppercase, lowercase, special character!"
    }

    const hash = await bcrypt.hash(password, 16);
    const userCollection = await users();
    const exist = await userCollection.findOne({ userId: userId });

  if (exist) {
    throw 'There is already a user with that userId.';
  }

    const newUser = {
        firstName,
        lastName,
        userId,
        hash,
    }
     
    const insertInfo = await userCollection.insertOne(newUser); //edit collection 
 
 if (!insertInfo.acknowledged || !insertInfo.insertedId)
  throw 'Could not add user';


return { registrationCompleted: true };

},


async removeUser (
    userId
) {
    const userCollection = await users();
    const deletedOne = await userCollection.findOneandDelete(userId); //edit collection 
    console.log(deletedOne);

}
};

export default exportedMethods;