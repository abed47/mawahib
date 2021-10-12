import { db } from "../index";
import { DataTypes } from "sequelize";

const Channel = db.define('channel', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slogan:{
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cover: {
        type: DataTypes.STRING,
        allowNull: true
    },
    watermark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true
});

export default Channel;