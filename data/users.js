import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

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

    const newUser = {
        
    }
},

async removeUser (
    userId
) {

}
};

export default exportedMethods;