const express = require('express');
const router = express.Router();
const { signupPage, signup, login, loginPage, isAuthenticated } = require('../controllers/userController');
const Todo = require('../Models/Todos')

//Get all todos
router.get('/todos', isAuthenticated, async (req, res) => {
    try {
        const allTodos = await Todo.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
        const uncompleted = allTodos.filter(todo => !todo.completed);
        const completed = allTodos.filter(todo => todo.completed);
        res.render('todos', { uncompleted, completed, message: null, user: req.session.user, todos: allTodos });
    } catch (err) {
        res.render('todos', { uncompleted: [], completed: [], user: req.session.user,  todos: allTodos, message: 'Error loading todos' });
    }
});


router.put('/todo/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body;

        console.log("PUT /todo/:id triggered");
        console.log("Task:", task);
        console.log("Todo ID:", id);

        await Todo.findByIdAndUpdate(id, { task });
        res.redirect('/todos');
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).send("Failed to update todo");
    }
});

//Add a Todo
router.post('/todo', isAuthenticated, async (req, res) => {
    const { task } = req.body;
    if (!task) return res.redirect('/todos');

    try {
        const newTodo = new Todo({ task, userId: req.session.user._id });
        await newTodo.save();
        res.redirect('/todos');
    } catch (err) {
        res.render('todos', { todos: [], message: 'Failed to add todo' });
    }
});

//Update a Todo
router.post('/todo/:id/toggle', isAuthenticated, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            todo.completed = !todo.completed;
            await todo.save();
        }
        res.redirect('/todos');
    } catch (err) {
        console.error('Toggle complete error:', err);
        res.redirect('/todos');
    }
});

// delete a Todo
router.delete('/todo/:id', isAuthenticated, async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.redirect('/todos');
    } catch (err) {
        res.render('todos', { todos: [], message: 'Failed to delete todo' });
    }
});



router.get('/signup', signupPage);
router.post('/signup', signup);

router.get('/login', loginPage);
router.post('/login', login);
router.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    })
})


module.exports = router;