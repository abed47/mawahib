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
        type: DataTypes.TEXT,
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
    },
    sponsor_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sponsor_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    first_prize_amount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    second_prize_amount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    third_prize_amount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prize_pool_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    can_vote: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, { timestamps: true });

export default Event;