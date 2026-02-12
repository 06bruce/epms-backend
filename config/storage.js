import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

class Storage {
    constructor(collectionName) {
        this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    read() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${this.filePath}:`, error);
            return [];
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing to ${this.filePath}:`, error);
        }
    }

    findAll() {
        return this.read();
    }

    find(predicate) {
        return this.read().filter(predicate);
    }

    findOne(predicate) {
        return this.read().find(predicate);
    }

    insert(item) {
        const data = this.read();
        const newItem = {
            ...item,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newItem);
        this.write(data);
        return newItem;
    }

    update(predicate, updates) {
        const data = this.read();
        const index = data.findIndex(predicate);
        if (index !== -1) {
            data[index] = {
                ...data[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.write(data);
            return data[index];
        }
        return null;
    }

    delete(predicate) {
        const data = this.read();
        const initialLength = data.length;
        const filteredData = data.filter(item => !predicate(item));
        if (filteredData.length !== initialLength) {
            this.write(filteredData);
            return true;
        }
        return false;
    }
}

export const usersStorage = new Storage('users');
export const departmentsStorage = new Storage('departments');
export const employeesStorage = new Storage('employees');
export const salariesStorage = new Storage('salaries');
export const countersStorage = new Storage('counters');

// Special helper for auto-incrementing IDs (like employeeNumber)
export const getNextSequence = (name) => {
    const counters = countersStorage.read();
    let counter = counters.find(c => c._id === name);

    if (!counter) {
        counter = { _id: name, seq: 1 };
        counters.push(counter);
    } else {
        counter.seq += 1;
    }

    countersStorage.write(counters);
    return counter.seq;
};
