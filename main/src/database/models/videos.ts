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
        allowNull: true
    },
    url:{
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail:{
        type: DataTypes.STRING,
        allowNull: true
    },
    featured:{
        type: DataTypes.STRING,
        allowNull: true
    },
    recommended_home: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    banner: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    tags:{
        type: DataTypes.STRING,
        allowNull: true
    },
    kids: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    mysterious: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    has_promotion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    premier: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
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
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1 // 1 = normal, 2 = event video, 3 = live
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stage_number: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    video_uid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stream_key: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    paranoid: true,
    timestamps: true
});

export default Video;