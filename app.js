const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + "/date.js")

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const run = async () => {
        await mongoose.connect('mongodb+srv://admin-femi:oluwafemi@cluster0.ulvxftn.mongodb.net/todoListDB');
    };

    mongoose.set('strictQuery', false);
    run();   
    
    const todoSchema = new mongoose.Schema({
        name: String
    }); 

    const Todo = mongoose.model('todo', todoSchema);

    const item1 = new Todo({
        name: 'Buy Food'
    })
    const item2 = new Todo({
        name: 'Cook Food'
    })
    const item3 = new Todo({
        name: 'Eat Food'
    })

    const defaultItem = [item1, item2, item3];
    const listSchema = {
        name: String,
        items: [todoSchema]
    };

    const List = mongoose.model('List', listSchema);

    

app.get('/', (req, res) => {
    
    Todo.find((err, results) => {
        if(results.length === 0){
            Todo.insertMany(defaultItem, (err) => {
                if(err){
                    console.log(err)
                } else {
                    console.log('successful')
                }
            })
            res.redirect('/')
        } else {
            res.render('list', {listTitle: 'Today', newItemLists: results});
        }
    })

})

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/:customListTitle', (req, res) => {
    const param = _.capitalize(req.params.customListTitle); 


    List.findOne({name: param}, (err, results) => {
        if(!err){
                if(!results){
                    const list = new List({
                        name: param,
                        items: defaultItem
                    })
                
                    list.save();
                    res.redirect('/' + param)
                } else {
                    res.render('list', {listTitle: results.name, newItemLists: results.items})
                }       
            } 
    })
})

app.post('/', (req, res) => {
    const newItem = req.body.item;
    const listName = req.body.list;

    const item = new Todo({
        name: newItem
    })

    if(listName === 'Today'){
        item.save();
    res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, results) => {
            results.items.push(item);
            results.save();

            res.redirect('/' + listName);
        })
    }
    
    });

    app.post('/delete', (req, res) => {
        const todoId = req.body.checkbox;
        const listName = req.body.listName;

        if(listName === 'Today'){
            Todo.findByIdAndRemove(todoId, (err) => {
                if(err){
                    console.log(err)
                } else{
                    console.log('successfully deleted the todoItem')
                }
    
                res.redirect('/')
            })
        } else {
            List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: todoId}}}, (err, results) => {
                if(!err){
                    res.redirect('/' + listName);
                }
            })
        }

        
    })

app.listen(3000, () => {
    console.log('server started on port 3000')
});