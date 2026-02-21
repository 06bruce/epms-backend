import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    departmentCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grossSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true // User who created it
    }
}, {
    timestamps: true
});

export default Department;
