const mongoose = require('mongoose');
const Schema = mongoose.Schema

const todoSchema = new Schema({
    task: {
        type: String,
        required: true
   }, 
   createdAt: {
        type: Date,
        default: Date.now
   }, 
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
  }, 
  completed: {
    type: Boolean,
    default: false
}
})


const Todo = mongoose.model('Todos', todoSchema);

module.exports = Todo
