import { DataTypes } from 'sequelize';
import { db } from '..';

const EventStage = db.define('event_stage', {
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stage_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    submission_start: {
        type: DataTypes.DATE,
        allowNull: true
    },
    submission_end: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1 //1 = filtration, 2= published
    }
}, { timestamps: true });

export default EventStage;