import { db } from "..";
import { DataTypes } from "sequelize";

const Subscription = db.define('subscription', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    channel_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    channel_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    channel_photo:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

export default Subscription;