import { sequelize } from '../config/db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Employee from '../models/Employee.js';
import Salary from '../models/Salary.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
    try {
        console.log('⏳ Syncing database...');
        // Sync all models (creates tables if they don't exist)
        await sequelize.sync({ force: false }); // force: true will drop tables if they exist
        console.log('✅ Database synced successfully.');

        // Optional: Add initial admin user if no users exist
        const userCount = await User.count();
        if (userCount === 0) {
            console.log('🌱 Seeding initial admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                fullName: 'System Administrator',
                role: 'admin'
            });
            console.log('✅ Admin user created (admin/admin123)');
        }

        console.log('🎉 Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during database seeding:', error.message);
        process.exit(1);
    }
};

seedDatabase();
