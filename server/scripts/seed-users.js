require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is required in environment variables.');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
    password: { type: String },
    isAccountVerified: { type: Boolean, default: false },
    isUserIdentityVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const SEED_USERS = [
  {
    fullName: 'Test Renter',
    email: 'renter@test.com',
    password: 'Test@123456',
    role: 'renter',
    isAccountVerified: true,
    isUserIdentityVerified: true,
  },
  {
    fullName: 'Test Owner',
    email: 'owner@test.com',
    password: 'Test@123456',
    role: 'owner',
    isAccountVerified: true,
    isUserIdentityVerified: true,
  },
  {
    fullName: 'Test Admin',
    email: 'admin@test.com',
    password: 'Test@123456',
    role: 'admin',
    isAccountVerified: true,
    isUserIdentityVerified: true,
  },
];

async function seedUsers() {
  await mongoose.connect(MONGODB_URI);

  for (const user of SEED_USERS) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    await User.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          fullName: user.fullName,
          role: user.role,
          password: hashedPassword,
          isAccountVerified: user.isAccountVerified,
          isUserIdentityVerified: user.isUserIdentityVerified,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Seeded user: ${user.email} (${user.role})`);
  }

  await mongoose.disconnect();
  console.log('User seeding complete.');
}

seedUsers().catch(async (err) => {
  console.error('Failed to seed users:', err.message || err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
