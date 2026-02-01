// MongoDB initialization script
db = db.getSiblingDB('digital_housing');

// Create collections if they don't exist
const collections = ['users', 'properties', 'messages', 'reservations', 'reviews', 'reports'];
collections.forEach((c) => {
  if (!db.getCollectionNames().includes(c)) {
    db.createCollection(c);
  }
});

// Create indexes for better performance
db.getCollection('users').createIndex({ email: 1 }, { unique: true });
db.getCollection('users').createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.getCollection('properties').createIndex({ village: 1 });
db.getCollection('properties').createIndex({ ownerId: 1 });
db.getCollection('properties').createIndex({ "address.coordinates": "2dsphere" });
db.getCollection('messages').createIndex({ senderId: 1, receiverId: 1 });
db.getCollection('messages').createIndex({ timestamp: -1 });
db.getCollection('reservations').createIndex({ renterId: 1 });
db.getCollection('reservations').createIndex({ propertyId: 1 });
db.getCollection('reviews').createIndex({ targetUserId: 1 });
db.getCollection('reports').createIndex({ reportedUserId: 1 });

print('Database initialized successfully!');