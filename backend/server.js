const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Book Exchange API! Access the frontend at http://localhost:3000');
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/exchanges', require('./routes/exchangeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Seeding function for Professional Sample Data
const seedInitialData = async () => {
    try {
        // 1. Create Sample Student Users
        const student1 = await User.findOne({ email: 'rohit@university.com' });
        const student2 = await User.findOne({ email: 'sneha@university.com' });

        let s1Id, s2Id;

        if (!student1) {
            const s1 = await User.create({
                name: 'Rohit Sharma',
                email: 'rohit@university.com',
                password: 'password123',
                phone: '9876543210',
                role: 'student'
            });
            s1Id = s1._id;
            console.log('✅ Student 1 created');
        } else {
            s1Id = student1._id;
        }

        if (!student2) {
            const s2 = await User.create({
                name: 'Sneha Patel',
                email: 'sneha@university.com',
                password: 'password123',
                phone: '8765432109',
                role: 'student'
            });
            s2Id = s2._id;
            console.log('✅ Student 2 created');
        } else {
            s2Id = student2._id;
        }

        const admin = await User.findOne({ email: 'admin@bookexchange.com' });
        const adminId = admin._id;

        // 2. Create Sample Books
        const bookCount = await Book.countDocuments();
        if (bookCount < 5) {
            // Clear existing if too few
            await Book.deleteMany({});

            const sampleBooks = [
                {
                    title: "Advanced algorithms & Data Structures",
                    author: "Thomas H. Cormen",
                    price: 850,
                    condition: "New",
                    category: "Engineering",
                    isFeatured: true,
                    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=2069",
                    owner: adminId
                },
                {
                    title: "Modern JavaScript: The Definitive Guide",
                    author: "David Flanagan",
                    price: 499,
                    condition: "Like New",
                    category: "Engineering",
                    isFeatured: true,
                    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=2070",
                    owner: s1Id
                },
                {
                    title: "Gray's Anatomy for Students",
                    author: "Richard Drake",
                    price: 1200,
                    condition: "Good",
                    category: "Medical",
                    isFeatured: true,
                    image: "https://images.unsplash.com/photo-1532187875605-1ef6c237a1e1?auto=format&fit=crop&q=80&w=2070",
                    owner: s2Id
                },
                {
                    title: "Principles of Microeconomics",
                    author: "N. Gregory Mankiw",
                    price: 350,
                    condition: "Fair",
                    category: "Business",
                    image: "https://images.unsplash.com/photo-1611974714851-48206138d731?auto=format&fit=crop&q=80&w=2070",
                    owner: s1Id
                },
                {
                    title: "The Elements of Style",
                    author: "William Strunk Jr.",
                    price: 150,
                    condition: "Good",
                    category: "Arts",
                    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=2046",
                    owner: adminId
                },
                {
                    title: "Astrophysics for People in a Hurry",
                    author: "Neil deGrasse Tyson",
                    price: 550,
                    condition: "Like New",
                    category: "Science",
                    isFeatured: true,
                    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=2070",
                    owner: s2Id
                },
                {
                    title: "Artificial Intelligence: A Modern Approach",
                    author: "Stuart Russell",
                    price: 900,
                    condition: "New",
                    category: "Engineering",
                    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2000",
                    owner: s1Id
                },
                {
                    title: "Organic Chemistry: Structure and Function",
                    author: "K. Peter C. Vollhardt",
                    price: 750,
                    condition: "Good",
                    category: "Science",
                    image: "https://images.unsplash.com/photo-1532187875605-1ef6c237a1e1?auto=format&fit=crop&q=80&w=2000",
                    owner: s2Id
                },
                {
                    title: "Marketing Management",
                    author: "Philip Kotler",
                    price: 600,
                    condition: "Like New",
                    category: "Business",
                    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",
                    owner: s1Id
                },
                {
                    title: "The Story of Art",
                    author: "E.H. Gombrich",
                    price: 800,
                    condition: "New",
                    category: "Arts",
                    image: "https://images.unsplash.com/photo-1547891301-15a99996b7cd?auto=format&fit=crop&q=80&w=2000",
                    owner: adminId
                },
                {
                    title: "Robbins Basic Pathology",
                    author: "Vinay Kumar",
                    price: 1100,
                    condition: "Good",
                    category: "Medical",
                    image: "https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&q=80&w=2000",
                    owner: s2Id
                },
                {
                    title: "Introduction to Thermal Physics",
                    author: "Daniel V. Schroeder",
                    price: 450,
                    condition: "Fair",
                    category: "Science",
                    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2000",
                    owner: s1Id
                },
                {
                    title: "Business Communication Essentials",
                    author: "Courtland L. Bovee",
                    price: 300,
                    condition: "Good",
                    category: "Business",
                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000",
                    owner: s2Id
                },
                {
                    title: "Database System Concepts",
                    author: "Abraham Silberschatz",
                    price: 850,
                    condition: "Like New",
                    category: "Engineering",
                    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=2000",
                    owner: s1Id
                },
                {
                    title: "Thinking, Fast and Slow",
                    author: "Daniel Kahneman",
                    price: 400,
                    condition: "New",
                    category: "Others",
                    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=2000",
                    owner: adminId
                }
            ];
            await Book.insertMany(sampleBooks);
            console.log('✅ 15+ Professional seed books added');
        }
    } catch (err) {
        console.log('Seed error:', err.message);
    }
};

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📚 Book Exchange API: http://localhost:${PORT}`);

    // Create Default Admin and Seed Data
    try {
        const adminExists = await User.findOne({ email: 'admin@bookexchange.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@bookexchange.com',
                password: 'admin123',
                phone: '1234567890',
                role: 'admin'
            });
            console.log('✅ Default admin user created');
        }
        await seedInitialData();
    } catch (error) {
        console.log('Admin init error:', error.message);
    }
});
