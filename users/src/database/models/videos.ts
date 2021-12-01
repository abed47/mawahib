import { DataTypes } from "sequelize";
import { db } from "../index";

const Video = db.define('video', {
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT({length: 'long'}),
        allowNull: true
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false
    },
    q_144:{
        type: DataTypes.STRING,
        allowNull: true
    },
    q_240:{
        type: DataTypes.STRING,
        allowNull: true
    },
    q_320:{
        type: DataTypes.STRING,
        allowNull: true
    },
    q_720:{
        type: DataTypes.STRING,
        allowNull: true
    },
    q_1080:{
        type: DataTypes.STRING,
        allowNull: true
    },
    thumbnail:{
        type: DataTypes.STRING,
        allowNull: true
    },
    featured:{
        type: DataTypes.STRING,
        allowNull: true
    },
    banner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        /**
         * 1 = pending
         * 2 = succeeded
         * 3 = error
         * 4 = ban error
         */
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    }
}, {
    paranoid: true,
    timestamps: true
});

export default Video;