// This file is repurposed to export the storage utility
import { usersStorage, departmentsStorage, employeesStorage, salariesStorage, getNextSequence } from './storage.js';

export {
    usersStorage,
    departmentsStorage,
    employeesStorage,
    salariesStorage,
    getNextSequence
};

// Dummy connect function for index.js compatibility
const connectDB = async () => {
    console.log("📂 Local JSON storage initialized");
    return Promise.resolve();
};

export default connectDB;