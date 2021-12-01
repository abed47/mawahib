import { db } from "../index";
import { DataTypes } from "sequelize";

const Comment = db.define('comment', {
    content:{
        type: DataTypes.STRING(600),
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    video_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true,
    paranoid: true
});

export default Comment;