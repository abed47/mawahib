import { db } from "..";
import { DataTypes } from 'sequelize';

const Category = db.define('category', {
    name:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    home: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    timestamps: true,
    paranoid: true
});

export default Category;