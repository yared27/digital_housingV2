// scripts/mongo-init.ts
import 'dotenv/config';
import { MongoClient } from "mongodb";
// Ensure the URI is defined
const uri = process.env.MONGODB_URI;
if (!uri)
    throw new Error("❌ MONGODB_URI is not defined in .env");
// Create a MongoClient
const client = new MongoClient(uri);
async function initDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
        const db = client.db("digital_housing_db");
        const collections = await db.listCollections().toArray();
        const existingCollections = collections.map(c => c.name);
        const collectionNames = [
            "users",
            "properties",
            "messages",
            "reservations",
            "reviews",
            "reports"
        ];
        for (const name of collectionNames) {
            if (!existingCollections.includes(name)) {
                await db.createCollection(name);
                console.log(`Created collection: ${name}`);
            }
            else {
                console.log(`Collection already exists: ${name}`);
            }
        }
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
        await db.collection("users").createIndex({ googleId: 1 }, { unique: true });
        await db.collection("properties").createIndex({ village: 1 });
        await db.collection("properties").createIndex({ ownerId: 1 });
        await db.collection("properties").createIndex({ "address.coordinates": "2dsphere" });
        await db.collection("messages").createIndex({ senderId: 1, receiverId: 1 });
        await db.collection("messages").createIndex({ timestamp: -1 });
        await db.collection("reservations").createIndex({ renterId: 1 });
        await db.collection("reservations").createIndex({ propertyId: 1 });
        await db.collection("reviews").createIndex({ targetUserId: 1 });
        await db.collection("reports").createIndex({ reportedUserId: 1 });
        console.log("✅ Database initialized successfully!");
    }
    catch (err) {
        console.error("❌ DB init error:", err);
    }
    finally {
        await client.close();
    }
}
initDB();
//# sourceMappingURL=mongo-init.js.map