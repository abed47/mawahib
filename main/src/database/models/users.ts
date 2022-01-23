import { db } from "../index";
import { DataTypes } from "sequelize";

const User = db.define('user',{
    first_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    middle_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dob:{
        type: DataTypes.DATE,
        allowNull: true
    },
    otp:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fcm_token:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fb_token:{
        type: DataTypes.STRING,
        allowNull: true
    },
    g_token:{
        type: DataTypes.STRING,
        allowNull: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    },
    photo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    last_login_ip:{
        type: DataTypes.STRING,
        allowNull: true
    },
    banned:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    ban_reason:{
        type: DataTypes.STRING,
        allowNull: true
    },
    channel_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    country:{
        type: DataTypes.STRING,
        allowNull: true
    },
    verified: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    timestamps: true,
    paranoid: true
});

export default User;