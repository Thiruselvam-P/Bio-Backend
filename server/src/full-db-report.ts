import { MongoClient } from 'mongodb';
import * as fs from 'fs';

async function bootstrap() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);
    let output = '';

    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();

        for (const dbInfo of dbs.databases) {
            output += `DATABASE: ${dbInfo.name}\n`;
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                output += `  COLLECTION: ${col.name}, COUNT: ${count}\n`;
            }
        }
    } catch (err) {
        output += `ERROR: ${err.message}\n`;
    } finally {
        await client.close();
        fs.writeFileSync('db-full-report.txt', output);
    }
}
bootstrap();
