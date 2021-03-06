import { DataTypes } from 'sequelize';
import { db } from '..';

const EventSubscription = db.define('event_subscription', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true })

export default EventSubscription;