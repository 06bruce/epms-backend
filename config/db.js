import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'epms',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log, // Set to console.log to see SQL queries
        dialectOptions: {
            ssl: process.env.DB_SSL_MODE === 'REQUIRED' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🚀 MySQL Database connected successfully with Sequelize');
    } catch (error) {
        console.error('❌ Unable to connect to the MySQL database:', error.message);
        // In production, you might want to exit the process
        // process.exit(1);
    }
};

export { sequelize };
export default connectDB;