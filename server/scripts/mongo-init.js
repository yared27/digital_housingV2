// MongoDB initialization script
db = db.getSiblingDB('digital_housing');

// Create collections
db.createCollection('users');
db.createCollection('properties');
db.createCollection('messages');
db.createCollection('reservations');
db.createCollection('reviews');
db.createCollection('reports');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true });
db.properties.createIndex({ village: 1 });
db.properties.createIndex({ ownerId: 1 });
db.properties.createIndex({ "address.coordinates": "2dsphere" });
db.messages.createIndex({ senderId: 1, receiverId: 1 });
db.messages.createIndex({ timestamp: -1 });
db.reservations.createIndex({ renterId: 1 });
db.reservations.createIndex({ propertyId: 1 });
db.reviews.createIndex({ targetUserId: 1 });
db.reports.createIndex({ reportedUserId: 1 });

print('Database initialized successfully!');