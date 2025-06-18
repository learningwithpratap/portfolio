// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for cross-origin requests
const path = require('path'); // For serving static files

const app = express();
const port = 3000; // You can choose any available port

// --- MongoDB Connection ---
// Replace 'YOUR_MONGODB_CONNECTION_STRING' with your actual MongoDB connection string.
// For example, if running locally: 'mongodb://localhost:27017/portfolioDB'
// Or for MongoDB Atlas: 'mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority'
const dbURI = 'mongodb://localhost:27017/portfolioDB'; // Default local connection
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema and Model ---
const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Remove whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Convert email to lowercase
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email regex validation
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes, allowing your frontend to make requests
app.use(express.json()); // Parse JSON bodies of incoming requests

// Serve static files (your HTML, CSS, JS if they were in a 'public' folder)
// For this setup, the HTML is separate, but good practice for fullstack apps.
// app.use(express.static(path.join(__dirname, 'public')));


// --- API Routes ---

// POST endpoint for contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newContactMessage = new ContactMessage({ name, email, message });
        await newContactMessage.save(); // Save to MongoDB

        console.log('New contact message saved:', newContactMessage);
        res.status(201).json({ message: 'Message sent successfully!', data: newContactMessage });

    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// Basic root route for testing if the server is running
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Contact form API endpoint: http://localhost:${port}/api/contact`);
});

/*
To run this backend:
1. Save the code above as `server.js` in a new directory (e.g., `portfolio-backend`).
2. Open your terminal/command prompt, navigate to that directory.
3. Run `npm init -y` to create a package.json file.
4. Install necessary packages: `npm install express mongoose cors`
5. Run the server: `node server.js`

Make sure your MongoDB instance is running before starting the server.
*/
