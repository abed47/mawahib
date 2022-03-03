import { DataTypes } from "sequelize";
import { db } from "../index";

const Event = db.define('event', {
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cover: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 //0 = pending, 1 = upcoming , 2 = ongoing, 3 = finished, 4 = cancelled
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    registration_start: {
        type: DataTypes.DATE,
        allowNull: true
    },
    registration_end: {
        type: DataTypes.DATE,
        allowNull: true
    },
    stage_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1 // 3
    },
    current_stage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1 // 2
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { timestamps: true });

export default Event;