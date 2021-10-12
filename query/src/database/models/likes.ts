import { DataTypes } from "sequelize";
import { db } from "..";

const Like = db.define('like', {
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {paranoid: true, timestamps: true});

export default Like;