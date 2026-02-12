import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const resetStorage = () => {
  console.log("🧹 Resetting local JSON storage...");

  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        fs.writeFileSync(filePath, JSON.stringify([]));
        console.log(`  - Cleared ${file}`);
      }
    }
  }

  console.log("✅ Storage reset successfully.");
};

resetStorage();
