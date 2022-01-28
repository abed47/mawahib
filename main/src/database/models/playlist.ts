import { DataTypes } from 'sequelize';
import { db } from '..';

const Playlist = db.define('playlist', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true })

export default Playlist;