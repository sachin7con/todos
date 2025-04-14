// SGN , JSP, JSSR, JBB, JSRK, JMD, JSLV, JMD, JSVM 
const express = require('express')
const fs = require('fs').promises
const mongoose = require('mongoose')
const app = express()
const path = require('path');
const methodOverride = require('method-override');

const session = require('express-session');
const Todo = require('./Models/Todos');


mongoose.connect('mongodb+srv://sachin7con:0hWkPBCfPtXVWAiP@cluster0.cvku5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then( res => {
    console.log('connected to db')
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

// let todos = [];

// async function readFromFile() {
//     try {

    
//     const data = await fs.readFile('./todos.json', 'utf-8')
//     if(!data){
//         console.log('No text')
//     }
//     todos = JSON.parse(data)

//     }
//     catch(err){
//         console.error('error in reading file', err)
//     }
// }

// async function writeTodoToFile() {
//     try{
//         await fs.writeFile('./todos.json', JSON.stringify(todos), 'utf-8')
//     }
//     catch(err){
//         console.error('error in writing file', err)

//     }
// }


// readFromFile();
app.listen(3000, () => {
        console.log('Listening to port 3000')
})