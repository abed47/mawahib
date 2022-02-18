import { DataTypes } from 'sequelize';
import { db } from '..';

const Transaction = db.define('transaction', {
    ref: {
        type: DataTypes.STRING,
        allowNull: true
    },
    wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        defaultValue: 1//1 = pending, 2 = verifying, 3 = approved, 4 = rejected
    }
}, { timestamps: true });

export default Transaction;