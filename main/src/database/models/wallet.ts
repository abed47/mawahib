import { DataTypes } from "sequelize";
import { db } from "..";

const Wallet = db.define('wallet', {
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    }
}, { timestamps: true });

export default Wallet;