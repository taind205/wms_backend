import { Sequelize } from 'sequelize';

// Option 1: Passing a connection URI
//const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
const sequelize = new Sequelize('mysql://root:tNOxA2GM09w4Tqus5VTy@containers-us-west-56.railway.app:5537/railway') // Example for postgres


// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT
//   });

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

export default connect;