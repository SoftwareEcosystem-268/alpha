import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/richsave'

// Comprehensive sample deals with more variety
const sampleDeals = [
  // Food Deals
  {
    title: '50% Off All Pizzas',
    description: 'Get half price on all large and medium pizzas. Valid for dine-in and delivery. Perfect for family dinners and parties!',
    discount: '50%',
    originalPrice: 30,
    discountedPrice: 15,
    storeName: "Domino's Pizza",
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    category: 'Food',
    location: { lat: 40.7128, lng: -74.006, address: '123 Main St, New York, NY 10001' },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    terms: ['Valid for dine-in and delivery only', 'Not valid with other offers', 'One coupon per order'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Buy 1 Get 1 Free Burgers',
    description: 'Purchase any burger and get the second one absolutely free! Valid on all burger varieties.',
    discount: 'BOGO',
    originalPrice: 12,
    discountedPrice: 6,
    storeName: 'Burger King',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    category: 'Food',
    location: { lat: 40.7484, lng: -73.9857, address: '789 5th Ave, New York, NY 10018' },
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    terms: ['Free item must be of equal or lesser value', 'Dine-in only', 'Cannot combine with other offers'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Free Coffee with Any Purchase',
    description: 'Get a free regular coffee when you buy any breakfast item. Start your day right!',
    discount: 'FREE',
    originalPrice: 5,
    discountedPrice: 0,
    storeName: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    category: 'Food',
    location: { lat: 40.7527, lng: -73.9772, address: '888 Madison Ave, New York, NY 10022' },
    expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    terms: ['Valid during breakfast hours (6AM-10AM)', 'Size: Tall only', 'While supplies last'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '$10 Off Your First Order',
    description: 'New customers get $10 off their first food delivery order of $25 or more. Order from your favorite restaurants!',
    discount: '$10',
    originalPrice: 35,
    discountedPrice: 25,
    storeName: 'DoorDash',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    category: 'Food',
    location: { lat: 40.7589, lng: -73.9851, address: 'Online Service - Nationwide' },
    expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    terms: ['New customers only', 'Minimum order $25', 'Valid on first order only', 'Service fees still apply'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '30% Off Sushi Platters',
    description: 'Enjoy fresh sushi at amazing prices! 30% off all sushi platters and combo meals.',
    discount: '30%',
    originalPrice: 45,
    discountedPrice: 31.5,
    storeName: 'Sushi Palace',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    category: 'Food',
    location: { lat: 40.7284, lng: -73.9947, address: '456 7th Ave, New York, NY 10001' },
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    terms: ['Dine-in only', 'Cannot combine with happy hour', 'Excludes drinks'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '2 For $20 Tacos',
    description: 'Get any 2 tacos for just $20! Choose from beef, chicken, or vegetarian options.',
    discount: '40%',
    originalPrice: 34,
    discountedPrice: 20,
    storeName: 'Taco Bell',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    category: 'Food',
    location: { lat: 40.7388, lng: -73.9817, address: '234 8th Ave, New York, NY 10011' },
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    terms: ['Valid at participating locations', 'While supplies last', 'One per customer'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Shopping Deals
  {
    title: '30% Off Running Shoes',
    description: 'Save big on all running shoes from top brands like Nike, Adidas, Puma, and more. Limited time offer!',
    discount: '30%',
    originalPrice: 150,
    discountedPrice: 105,
    storeName: 'Nike Store',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    category: 'Shopping',
    location: { lat: 40.758, lng: -73.9855, address: '456 Broadway, New York, NY 10012' },
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    terms: ['Valid on select styles', 'While supplies last', 'No rainchecks'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '20% Off All Books',
    description: 'Stock up on your summer reading! 20% off all books in store including bestsellers.',
    discount: '20%',
    originalPrice: 25,
    discountedPrice: 20,
    storeName: 'Barnes & Noble',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    category: 'Shopping',
    location: { lat: 40.758, lng: -73.9755, address: '999 6th Ave, New York, NY 10018' },
    expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    terms: ['Valid on in-stock items only', 'Not valid on textbooks', 'Excludes gift cards'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Buy 2 Get 1 Free Clothing',
    description: 'Mix and match! Buy any 2 clothing items and get the 3rd free. Lowest priced item is free.',
    discount: '33%',
    originalPrice: 90,
    discountedPrice: 60,
    storeName: 'H&M',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    category: 'Shopping',
    location: { lat: 40.7589, lng: -73.9851, address: '555 5th Ave, New York, NY 10017' },
    expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    terms: ['In-store only', 'Cannot combine with other offers', 'While supplies last'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '50% Off Second Item',
    description: 'Buy any item at full price and get 50% off the second item of equal or lesser value!',
    discount: '25%',
    originalPrice: 80,
    discountedPrice: 60,
    storeName: 'Zara',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    category: 'Shopping',
    location: { lat: 40.7614, lng: -73.9776, address: '750 5th Ave, New York, NY 10019' },
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    terms: ['Valid in-store only', 'One discount per customer', 'Exclusions may apply'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Electronics Deals
  {
    title: '40% Off Electronics',
    description: 'Massive savings on laptops, phones, tablets, and accessories. Limited quantities available!',
    discount: '40%',
    originalPrice: 999,
    discountedPrice: 599,
    storeName: 'Best Buy',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    category: 'Electronics',
    location: { lat: 40.7614, lng: -73.9776, address: '321 W 34th St, New York, NY 10001' },
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    terms: ['Excludes Apple products', 'In-store only', 'While supplies last'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '$200 Off MacBook Pro',
    description: 'Get $200 off select MacBook Pro models. Perfect for work and creativity!',
    discount: '20%',
    originalPrice: 999,
    discountedPrice: 799,
    storeName: 'Apple Store',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    category: 'Electronics',
    location: { lat: 40.7639, lng: -73.9753, address: '767 5th Ave, New York, NY 10153' },
    expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    terms: ['Valid on select models only', 'Education pricing excluded', 'While supplies last'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Buy 1 Get 1 Headphones',
    description: 'Buy one pair of headphones and get another pair free! Great for gifts!',
    discount: '50%',
    originalPrice: 80,
    discountedPrice: 40,
    storeName: 'Sony Store',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    category: 'Electronics',
    location: { lat: 40.758, lng: -73.9855, address: '432 W 14th St, New York, NY 10014' },
    expiresAt: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    terms: ['Free item must be of equal or lesser value', 'In-store only', 'No exchanges'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Fitness Deals
  {
    title: '25% Off Gym Membership',
    description: 'Get fit for less! Sign up today and save 25% on your first month plus free personal training session!',
    discount: '25%',
    originalPrice: 50,
    discountedPrice: 37.5,
    storeName: 'Planet Fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    category: 'Fitness',
    location: { lat: 40.7489, lng: -73.968, address: '555 W 42nd St, New York, NY 10036' },
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    terms: ['New members only', 'Valid on monthly memberships', 'ID required'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '50% Off Yoga Classes',
    description: 'New members get 50% off their first month of unlimited yoga classes. All levels welcome!',
    discount: '50%',
    originalPrice: 120,
    discountedPrice: 60,
    storeName: 'YogaWorks',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    category: 'Fitness',
    location: { lat: 40.7284, lng: -73.9947, address: '222 W 23rd St, New York, NY 10011' },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    terms: ['New students only', 'Mat rental included', 'All class types'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Free Personal Training Session',
    description: 'Get a free one-hour personal training session when you sign up for any membership plan!',
    discount: 'FREE',
    originalPrice: 75,
    discountedPrice: 0,
    storeName: 'Equinox',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    category: 'Fitness',
    location: { lat: 40.7614, lng: -73.9776, address: '91 Columbus Ave, New York, NY 10023' },
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    terms: ['New members only', 'By appointment only', '24-hour cancellation required'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Travel Deals
  {
    title: '30% Off Hotel Stays',
    description: 'Save 30% on hotel bookings! Valid at participating locations nationwide.',
    discount: '30%',
    originalPrice: 200,
    discountedPrice: 140,
    storeName: 'Hotels.com',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    category: 'Travel',
    location: { lat: 40.7589, lng: -73.9851, address: 'Online Service - Nationwide' },
    expiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    terms: ['Minimum 2-night stay', 'Blackout dates may apply', 'Cannot combine with other offers'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '$50 Off Flight Bookings',
    description: 'Get $50 off round-trip flights to select destinations. Limited seats available!',
    discount: '$50',
    originalPrice: 350,
    discountedPrice: 300,
    storeName: 'Expedia',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    category: 'Travel',
    location: { lat: 40.7589, lng: -73.9851, address: 'Online Service - Nationwide' },
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    terms: ['Minimum purchase $300', 'Valid on select airlines', 'Travel within 60 days'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Entertainment Deals
  {
    title: '2 For 1 Movie Tickets',
    description: 'Buy one movie ticket and get one free! Valid on all showings before 5PM.',
    discount: '50%',
    originalPrice: 30,
    discountedPrice: 15,
    storeName: 'AMC Theatres',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    category: 'Entertainment',
    location: { lat: 40.7589, lng: -73.9851, address: '234 W 42nd St, New York, NY 10036' },
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    terms: ['Valid before 5PM only', 'Not valid on special events', 'In-person only'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '20% Off Concert Tickets',
    description: 'Save 20% on select concert tickets! Use code LIVE20 at checkout.',
    discount: '20%',
    originalPrice: 150,
    discountedPrice: 120,
    storeName: 'Ticketmaster',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    category: 'Entertainment',
    location: { lat: 40.7589, lng: -73.9851, address: 'Online Service - Nationwide' },
    expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    terms: ['Code required', 'Excludes VIP packages', 'While supplies last'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db('richsave')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await db.collection('deals').deleteMany({})
    await db.collection('users').deleteMany({})
    await db.collection('redemptions').deleteMany({})
    await db.collection('otps').deleteMany({})

    // Insert sample deals
    console.log('📦 Inserting sample deals...')
    const dealResult = await db.collection('deals').insertMany(sampleDeals)
    console.log(`   ✅ Inserted ${dealResult.insertedCount} deals`)

    // Get the inserted deal IDs
    const dealIds = Object.values(dealResult.insertedIds)

    // Create Super User with full access
    console.log('👤 Creating super user...')
    const superUserPassword = await bcrypt.hash('SuperUser123!', 10)
    const superUser = await db.collection('users').insertOne({
      name: 'Super Admin',
      email: 'admin@richsave.com',
      password: superUserPassword,
      phone: '+66812345678',
      location: 'Bangkok, Thailand',
      favorites: dealIds.slice(0, 5).map((id: ObjectId) => id.toString()),
      preferences: {
        pushNotifications: true,
        locationServices: true,
        darkMode: false,
      },
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('   ✅ Super user created')

    // Create regular demo user
    console.log('👤 Creating demo user...')
    const demoUserPassword = await bcrypt.hash('Demo123!', 10)
    const demoUser = await db.collection('users').insertOne({
      name: 'Demo User',
      email: 'demo@richsave.com',
      password: demoUserPassword,
      phone: '+1234567890',
      location: 'New York, NY',
      favorites: dealIds.slice(0, 3).map((id: ObjectId) => id.toString()),
      preferences: {
        pushNotifications: true,
        locationServices: true,
        darkMode: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log('   ✅ Demo user created')

    // Create comprehensive redemption history for super user
    console.log('💰 Creating redemption history...')
    const today = new Date()
    const superUserRedemptions = [
      {
        userId: superUser.insertedId,
        dealId: dealIds[0].toString(),
        dealTitle: sampleDeals[0].title,
        storeName: sampleDeals[0].storeName,
        savings: 15,
        redeemedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[1].toString(),
        dealTitle: sampleDeals[1].title,
        storeName: sampleDeals[1].storeName,
        savings: 6,
        redeemedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[3].toString(),
        dealTitle: sampleDeals[3].title,
        storeName: sampleDeals[3].storeName,
        savings: 10,
        redeemedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[6].toString(),
        dealTitle: sampleDeals[6].title,
        storeName: sampleDeals[6].storeName,
        savings: 45,
        redeemedAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[7].toString(),
        dealTitle: sampleDeals[7].title,
        storeName: sampleDeals[7].storeName,
        savings: 5,
        redeemedAt: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[11].toString(),
        dealTitle: sampleDeals[11].title,
        storeName: sampleDeals[11].storeName,
        savings: 200,
        redeemedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[14].toString(),
        dealTitle: sampleDeals[14].title,
        storeName: sampleDeals[14].storeName,
        savings: 12.5,
        redeemedAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        userId: superUser.insertedId,
        dealId: dealIds[16].toString(),
        dealTitle: sampleDeals[16].title,
        storeName: sampleDeals[16].storeName,
        savings: 60,
        redeemedAt: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
    ]
    await db.collection('redemptions').insertMany(superUserRedemptions)
    console.log(`   ✅ Created ${superUserRedemptions.length} redemptions for super user`)

    // Create some redemptions for demo user
    const demoUserRedemptions = [
      {
        userId: demoUser.insertedId,
        dealId: dealIds[2].toString(),
        dealTitle: sampleDeals[2].title,
        storeName: sampleDeals[2].storeName,
        savings: 5,
        redeemedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: demoUser.insertedId,
        dealId: dealIds[4].toString(),
        dealTitle: sampleDeals[4].title,
        storeName: sampleDeals[4].storeName,
        savings: 13.5,
        redeemedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    ]
    await db.collection('redemptions').insertMany(demoUserRedemptions)
    console.log(`   ✅ Created ${demoUserRedemptions.length} redemptions for demo user`)

    console.log('\n' + '='.repeat(60))
    console.log('✅ Database seeded successfully!')
    console.log('='.repeat(60))

    console.log('\n🔐 SUPER USER CREDENTIALS (Full Access):')
    console.log('   Email:    admin@richsave.com')
    console.log('   Password: SuperUser123!')
    console.log('   Name:     Super Admin')

    console.log('\n🔐 DEMO USER CREDENTIALS:')
    console.log('   Email:    demo@richsave.com')
    console.log('   Password: Demo123!')
    console.log('   Name:     Demo User')

    console.log('\n📊 Database Summary:')
    console.log(`   • ${dealResult.insertedCount} deals created`)
    console.log(`   • 2 users created`)
    console.log(`   • ${superUserRedemptions.length + demoUserRedemptions.length} redemptions recorded`)
    console.log('\n   Total savings (Super User): $356.50')
    console.log('   Total savings (Demo User):  $18.50')

    console.log('\n💡 You can now login and explore the entire app!\n')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await client.close()
    console.log('🔌 MongoDB connection closed')
  }
}

seedDatabase()
