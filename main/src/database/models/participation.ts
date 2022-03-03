import { DataTypes } from 'sequelize';
import { db } from '..';

const Participation = db.define('participation', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    knocked_out_stage: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prize: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    prize_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stage_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, { timestamps: true});

export default Participation;