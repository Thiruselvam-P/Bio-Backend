import { MongoClient } from 'mongodb';

async function bootstrap() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('mj-fresh-bio');
        const products = await db.collection('products').find({}).limit(5).toArray();
        console.log(JSON.stringify(products, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
bootstrap();
