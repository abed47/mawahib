import { DataTypes } from 'sequelize';
import { db } from '..';

const Submission = db.define('submission', {
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    participation_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stage_number: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true });

export default Submission;