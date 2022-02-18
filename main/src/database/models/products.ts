import { DataTypes } from 'sequelize';
import { db } from '..';

const Product = db.define('product', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true });

export default Product;