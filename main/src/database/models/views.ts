import { DataTypes } from "sequelize";
import { db } from "..";

const View = db.define('view', {
    video_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});

export default View;