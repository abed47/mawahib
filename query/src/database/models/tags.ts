import { DataTypes } from "sequelize";
import { db } from "..";

const Tag = db.define('tag', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    video_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: false
});

export default Tag;