import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Salary = sequelize.define('Salary', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    employeeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grossSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    deductions: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    netSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['employeeNumber', 'month']
        }
    ]
});

export default Salary;
