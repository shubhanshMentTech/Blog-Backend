require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;


// to parse JSON bodies
// app.use(express.json());
// parse URL-encoded form data (e.g., from HTML forms)
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// connection to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to myBlogDb"))
.catch((err) => console.error("MongoDB connection error:", err));


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend origin
  credentials: true // If you need cookies/auth headers
}));


//Importing the auth routes module
// const auth = require("./ROUTES/auth");
// const blog = require("./ROUTES/blog");

// //using the auth route 
// app.use("/api/auth", auth)
// app.use("/api/blog", blog)

const routes = require('./ROUTES')

app.use(routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});