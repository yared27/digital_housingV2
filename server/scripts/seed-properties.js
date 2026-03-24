require('dotenv').config();
const mongoose = require('mongoose');

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
  },
  { timestamps: true }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, trim: true },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    price: {
      amount: { type: Number, required: true },
      period: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
    },
    propertyType: { type: String, enum: ['apartment', 'house', 'room', 'studio'], required: true },
    amenities: { type: [String], default: [] },
    propertyImages: { type: [String], default: [] },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

const OWNER_EMAILS = ['owner@test.com', 'admin@test.com'];

const BASE_IMAGES = [
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
];

const PROPERTY_SEEDS = [
  {
    title: 'Modern Studio Near Town Center',
    description: 'Fully furnished studio with reliable utilities, secure gate access, and fast internet.',
    village: 'Bweyogerere',
    address: {
      street: 'Plot 14 Market Street',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6475, 0.3476] },
    },
    price: { amount: 450, period: 'monthly' },
    propertyType: 'studio',
    amenities: ['wifi', 'parking', 'security', 'water-tank'],
    isAvailable: true,
    isVerified: true,
  },
  {
    title: 'Family House With Compound',
    description: 'Spacious 3-bedroom house with private compound, ideal for families.',
    village: 'Kira',
    address: {
      street: 'Nalya Estate Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6391, 0.3881] },
    },
    price: { amount: 950, period: 'monthly' },
    propertyType: 'house',
    amenities: ['parking', 'garden', 'security', 'water-heater'],
    isAvailable: true,
    isVerified: true,
  },
  {
    title: 'Budget Friendly Single Room',
    description: 'Clean single room close to transport routes and local shops.',
    village: 'Kyaliwajjala',
    address: {
      street: 'Mamerito Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6269, 0.3857] },
    },
    price: { amount: 150, period: 'monthly' },
    propertyType: 'room',
    amenities: ['water-tank', 'balcony', 'fenced-yard'],
    isAvailable: true,
    isVerified: false,
  },
  {
    title: 'Two Bedroom Apartment Block A',
    description: 'Bright apartment unit with modern kitchen, secure parking, and standby power.',
    village: 'Ntinda',
    address: {
      street: 'Kimera Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6099, 0.3533] },
    },
    price: { amount: 700, period: 'monthly' },
    propertyType: 'apartment',
    amenities: ['wifi', 'parking', 'backup-power', 'security'],
    isAvailable: true,
    isVerified: true,
  },
  {
    title: 'Executive Apartment Near Business Hub',
    description: 'Premium apartment with concierge access, elevator, and high-end finishing.',
    village: 'Kololo',
    address: {
      street: 'Wampewo Avenue',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.5844, 0.3367] },
    },
    price: { amount: 1400, period: 'monthly' },
    propertyType: 'apartment',
    amenities: ['wifi', 'elevator', 'gym', 'security', 'backup-power'],
    isAvailable: true,
    isVerified: true,
  },
  {
    title: 'Lake View Weekend House',
    description: 'Quiet house with lake-view terrace, perfect for long and short stays.',
    village: 'Entebbe',
    address: {
      street: 'Nakiwogo Road',
      city: 'Entebbe',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.4467, 0.0562] },
    },
    price: { amount: 120, period: 'daily' },
    propertyType: 'house',
    amenities: ['parking', 'lake-view', 'security', 'garden'],
    isAvailable: true,
    isVerified: false,
  },
  {
    title: 'Compact Starter Studio',
    description: 'Efficient studio setup for students or solo professionals with easy commute.',
    village: 'Wandegeya',
    address: {
      street: 'Bombo Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.5735, 0.3318] },
    },
    price: { amount: 280, period: 'monthly' },
    propertyType: 'studio',
    amenities: ['wifi', 'water-heater', 'security'],
    isAvailable: true,
    isVerified: false,
  },
  {
    title: 'Shared Room In Secure Compound',
    description: 'Affordable shared room in a calm and secure neighborhood.',
    village: 'Najjera',
    address: {
      street: 'Najjera 2 Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6141, 0.3906] },
    },
    price: { amount: 90, period: 'weekly' },
    propertyType: 'room',
    amenities: ['security', 'fenced-yard', 'water-tank'],
    isAvailable: true,
    isVerified: false,
  },
  {
    title: 'Townhouse Close To Schools',
    description: 'Comfortable townhouse with multiple bathrooms and a small private garden.',
    village: 'Bukoto',
    address: {
      street: 'Naguru Drive',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6008, 0.3403] },
    },
    price: { amount: 1100, period: 'monthly' },
    propertyType: 'house',
    amenities: ['parking', 'garden', 'wifi', 'backup-power'],
    isAvailable: false,
    isVerified: true,
  },
  {
    title: 'City Edge Apartment With Balcony',
    description: 'Well-ventilated apartment near key roads with balcony and dedicated parking.',
    village: 'Munyonyo',
    address: {
      street: 'Ggaba Road',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6256, 0.2396] },
    },
    price: { amount: 820, period: 'monthly' },
    propertyType: 'apartment',
    amenities: ['parking', 'balcony', 'security', 'wifi'],
    isAvailable: true,
    isVerified: true,
  },
  {
    title: 'Minimal One-Room Unit',
    description: 'Simple one-room unit with essential amenities and safe access.',
    village: 'Nansana',
    address: {
      street: 'Hoima Road',
      city: 'Wakiso',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.527, 0.3642] },
    },
    price: { amount: 130, period: 'monthly' },
    propertyType: 'room',
    amenities: ['security', 'water-tank'],
    isAvailable: true,
    isVerified: false,
  },
  {
    title: 'Serviced Apartment Premium Floor',
    description: 'Serviced apartment with cleaning support and fully equipped kitchen.',
    village: 'Bugolobi',
    address: {
      street: 'Luthuli Avenue',
      city: 'Kampala',
      state: 'Central',
      zipCode: '256',
      coordinates: { type: 'Point', coordinates: [32.6137, 0.3181] },
    },
    price: { amount: 1600, period: 'monthly' },
    propertyType: 'apartment',
    amenities: ['wifi', 'cleaning-service', 'security', 'backup-power', 'parking'],
    isAvailable: true,
    isVerified: true,
  },
];

function imageSet(seedIndex) {
  const first = BASE_IMAGES[seedIndex % BASE_IMAGES.length];
  const second = BASE_IMAGES[(seedIndex + 3) % BASE_IMAGES.length];
  const third = BASE_IMAGES[(seedIndex + 6) % BASE_IMAGES.length];
  return [first, second, third];
}

async function seedProperties() {
  await mongoose.connect(MONGODB_URI);

  const owners = await User.find({ email: { $in: OWNER_EMAILS }, role: { $in: ['owner', 'admin'] } })
    .select('_id email role')
    .lean();

  if (!owners.length) {
    throw new Error('No owner/admin users found. Run "npm run seed:users" first.');
  }

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < PROPERTY_SEEDS.length; i += 1) {
    const owner = owners[i % owners.length];
    const seed = PROPERTY_SEEDS[i];

    const payload = {
      ...seed,
      propertyImages: imageSet(i),
      ownerId: owner._id,
    };

    const result = await Property.updateOne(
      {
        title: seed.title,
        village: seed.village,
        ownerId: owner._id,
      },
      {
        $set: payload,
      },
      {
        upsert: true,
      }
    );

    if (result.upsertedCount > 0) inserted += 1;
    else updated += 1;

    console.log(`Seeded property: ${seed.title} [owner=${owner.email}]`);
  }

  await mongoose.disconnect();
  console.log(`Property seeding complete. Inserted: ${inserted}, Updated: ${updated}`);
}

seedProperties().catch(async (err) => {
  console.error('Failed to seed properties:', err.message || err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
