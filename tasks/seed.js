import {databaseConnection, closeConnection} from '../config/mongoConnection,js';

const db = await databaseConnection();
await db.dropDatabase();

console.log("Done seeding database.");

await closeConnection();