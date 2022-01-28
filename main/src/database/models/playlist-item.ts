import { DataTypes } from 'sequelize';
import { db } from '..';

const PlayListItem = db.define('playlist_item', {
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    playlist_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true });

export default PlayListItem;