import { DataTypes } from 'sequelize';
import { db } from '..';

const Vote = db.define('vote', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stage_number: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    participation_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    }
}, { timestamps: true });

export default Vote;