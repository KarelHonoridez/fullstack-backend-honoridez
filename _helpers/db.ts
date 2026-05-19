import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    let sequelize: Sequelize;

    // Dynamically choose between remote MySQL and local SQLite
    if (process.env.NODE_ENV === 'production' || process.env.DB_HOST) {
        console.log('Connecting to remote MySQL database...');
        sequelize = new Sequelize({
            dialect: 'mysql',
            host: process.env.DB_HOST || config.database.host,
            port: parseInt(process.env.DB_PORT || config.database.port.toString()),
            username: process.env.DB_USER || config.database.user,
            password: process.env.DB_PASSWORD || config.database.password,
            database: process.env.DB_NAME || config.database.database,
            logging: false,
            dialectOptions: {
                // Required by some cloud hosting services (e.g. Aiven, AWS RDS) for SSL
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
            }
        });
    } else {
        console.log('Connecting to local SQLite database...');
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: false
        });
    }

    // Init models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database (force-recreate to clear corrupt legacy rows)
    await sequelize.sync({ force: true });
    console.log('Database synchronization complete.');
}