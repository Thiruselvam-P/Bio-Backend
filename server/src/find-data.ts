import { MongoClient } from 'mongodb';

async function bootstrap() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const dbs = await client.db().admin().listDatabases();

        for (const dbInfo of dbs.databases) {
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                if (count > 0) {
                    console.log(`FOUND_DATA: DB=${dbInfo.name}, Collection=${col.name}, Count=${count}`);
                }
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
bootstrap();
