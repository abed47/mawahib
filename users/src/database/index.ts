import {Sequelize} from 'sequelize';
import * as dotenv from 'dotenv';

//init .env file
dotenv.config();



const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;

const sequelize = new Sequelize( DB_NAME, DB_USER, DB_PASS,
    {
        host: DB_HOST, 
        port: +DB_PORT,
        dialect: 'postgres',
        pool:{
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    }
)

let db:Sequelize = sequelize;


const connect: () => void = async () => {

    try{

        await sequelize.sync({force: false});

    }catch(err){
        console.log(err.message || err);
    }
    
}

export {connect, db}