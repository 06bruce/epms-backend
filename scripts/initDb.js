import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const collections = ['users', 'departments', 'employees', 'salaries', 'counters'];

const initStorage = () => {
  console.log("🚀 Initializing local JSON storage...");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    console.log("  - Created data directory");
  }

  for (const collection of collections) {
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      console.log(`  - Initialized ${collection}.json`);
    }
  }

  console.log("✅ Initialization complete.");
};

initStorage();
