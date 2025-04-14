// SGN , JSP, JSSR, JBB, JSRK, JMD, JSLV, JMD, JSVM 
const express = require('express');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const app = express();
const path = require('path');
const methodOverride = require('method-override');

const session = require('express-session');
const Todo = require('./Models/Todos');
const authRoutes = require('./routes/auth');

// ===== Database Connection =====
mongoose.connect(process.env.MONGO_URI)
.then(res => {
    console.log('connected to db');
})
.catch(err => {
    console.log(err);
});

// ===== Middleware Setup =====
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));  // 🔁 moved above methodOverride
app.use(express.json());                         // 🔁 moved above methodOverride
app.use(methodOverride('_method'));              // ✅ required for PUT/DELETE via POST form

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);

// ===== Server =====
app.listen(3000, () => {
    console.log('Listening to port 3000');
});