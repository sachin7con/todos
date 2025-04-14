// SGN , JSP, JSSR, JBB, JSRK, JMD, JSLV, JMD, JSVM 
const express = require('express')
const fs = require('fs').promises
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const app = express()
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const authRoutes = require('./routes/auth');

const session = require('express-session');
const Todo = require('./Models/Todos');


mongoose.connect(process.env.MONGO_URI)
.then( res => {
    console.log('connected to db')
})
.catch(err => {
    console.log(err)

})
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});