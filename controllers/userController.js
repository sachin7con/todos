const Users = require('../Models/Users.js')
const bcrypt = require('bcrypt');

const signupPage = (req, res) => {
    res.render('signup', {message: null });
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try{

        const existingUser = await Users.findOne({email});

        if(existingUser){
            return res.render('signup', {message: 'Email alredy registered!'})
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new Users({name, email, password : hashedPassword})
        await newUser.save();
        res.render('signup', { message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.render( 'signup', {message : 'Something went wrong'});
    }}

const loginPage = (req, res) => {
    return res.render('login', {message: null});
}    
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users.findOne({ email });
        if (!existingUser) {
            return res.render('login', { message: 'User is not registered, Please Sign up' });
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (isPasswordMatch) {
            req.session.user = existingUser; // Store user in session
            res.redirect('/home');
        } else {
            res.render('login', { message: 'Incorrect Password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { message: 'Login error. Please try again.' });
    }
};

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // If logged in, proceed to the next route
    }
    res.redirect('/login');  // If not logged in, redirect to login
}

module.exports = { signupPage, signup, loginPage, login, isAuthenticated }