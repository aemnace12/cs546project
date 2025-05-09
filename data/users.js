import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from "bcryptjs";
import validation from '../validation.js'

const exportedMethods = {
async createUser (
    firstName,
    lastName,
    userId,
    password,
    confirmPassword,
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
    userId = userId.toLowerCase();
    confirmPassword = validation.checkString(confirmPassword, "ConfirmPassword")
    if(userId.lenth > 5){
        throw "ID legth must be atleast 5 characters" // we can edit this
    }
    // password checks
    // atleast 8 char, 1 upper, a number and special character
    //check for no including space
    if (password.length < 6 || password.length > 20) {
        throw "Password must be between 6 and 20 characters";
      }
      

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/;

      if (!passwordRegex.test(password)) {
        throw "Password must include an uppercase letter, lowercase letter, number, and special character!";
      }
      if(password !== confirmPassword){
        throw "passwords are not the same"
      }

    const hash = await bcrypt.hash(password, 16);
    const userCollection = await users();
    const exist = await userCollection.findOne({ userId: userId });

  if (exist) {
    throw 'There is already a user with that userId.';
  }

    const favoritePlace = "none"; // default value
    const bio = "none"; // default value

    const newUser = {
        firstName,
        lastName,
        userId,
        password: hash,
        role, 
        favoritePlace,
        bio,
    };
     
    const insertInfo = await userCollection.insertOne(newUser); //edit collection 
 
 if (!insertInfo.acknowledged || !insertInfo.insertedId)
  throw 'Could not add user';


return { registrationCompleted: true, userId: userId }; // not sure if needed

},

async login(userId, password){
    if(!userId){
        throw 'please provide an userId!';
    }
    if(!password){
        throw 'please provide a password!';
    }
    userId = userId.toLowerCase();
    const userCollection = await users();

    const user = await userCollection.findOne({userId: userId});
    if(!user){
        throw 'User does not exist in our database!';
    }

    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if(!isMatch){
        throw 'Parameters are not correct!';
    }

    return{
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        role: user.role,
        favoritePlace: user.favoritePlace,
        bio: user.bio,
        
    }


},

async updateUser (
    userId,
    oldField,
    updateFields
) {

    if (!userId || typeof userId !== 'string') {
        throw 'userId must be a non-empty string';
      }
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
        { userId: userId },
        { $set: {[oldField]: updateFields} }, 
        { returnDocument: 'after' }
      );
      if (!updatedUser) {
        throw `couldnt find the user with userId: ${userId}`;
      }
      console.log(updatedUser.value);
      updatedUser._id= updatedUser._id.toString();
      return updatedUser;
},


async removeUser (
    userId
) {

    if (!userId || typeof userId !== 'string') {
        throw 'userId must be a non-empty string';
      }


    const userCollection = await users();
    const deletedResult = await userCollection.findOneAndDelete({ userId: userId }); //edit collection
    if (!deletedResult.value) {
        throw `No user found with userId: ${userId}`;
      }
   
    console.log(deletedResult.value);


}
};

export default exportedMethods;