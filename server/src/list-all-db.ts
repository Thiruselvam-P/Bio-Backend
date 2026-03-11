import { MongoClient } from 'mongodb';

async function bootstrap() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();

        console.log('--- Databases ---');
        for (const dbInfo of dbs.databases) {
            console.log(`Database: ${dbInfo.name}`);
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`  Collection: ${col.name}, Documents: ${count}`);
            }
        }
    } finally {
        await client.close();
    }
}
bootstrap();
