const express = require("express");
// const bodyparser = require("body-parser");
const cors = require('cors')
const mongoose = require("mongoose");
const app = express();
const port = 3333;

app.use(express.json());
app.use(cors({origin:"http://localhost:3000"}))
mongoose.connect("mongodb://127.0.0.1:27017/taskManagement")
    .then(() => console.log('MongoDB Connected!'));

const userSchema = new mongoose.Schema({ name: String, email: String, password: String });
const taskSchema = new mongoose.Schema({ 
    title: String, 
    desc: String, 
    dueDate: String, 
    status:String, 
    assignedUser: String 
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);


app.get("/", (req, res) => {
    res.send("Task Management Server");
});

// LOGIN 
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then((foundUser) => {
        // console.log(foundUser);
        if(foundUser === null){
            res.status(401).send("User Not Found")
        }
        else if (foundUser.password === password) {
            res.send("Login Successful");
        }
        else{
            res.status(401).send("Login Unuccessful")
        }
    }).catch(console.log);
})

// CREATE NEW USER
app.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        name: name,
        email: email,
        password: password
    })

    newUser.save().then(console.log)
    res.send(newUser);
});

// READ ALL USERS
app.get("/users", (req, res) => {
    User.find().then((allUsers) => {
        console.log(allUsers);
        res.send(allUsers);
    }); 
})

// CREATE NEW TASK
app.post("/addtask", (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const dueDate = req.body.dueDate;
    const status = req.body.status;
    const assignedUser = req.body.assignedUser;

    const newTask = new Task({
        title: title,
        desc: desc,
        dueDate: dueDate,
        status: status,
        assignedUser: assignedUser
    });

    newTask.save().then(console.log)
    res.send(newTask);
})

// READ ALL TASKS
app.get("/tasks", (req, res) => {
    Task.find().then((allTasks) => {
        console.log(allTasks);
        res.send(allTasks);
    }); 
})

// UPDATE TASK
app.put("/updatetask", (req, res) => {
    const filter = {_id: req.body._id};
    console.log(req.body._id);
    const update = req.body;
    Task.findOneAndUpdate(filter, update).then((result)=>{
        res.send(result);
    });
});

// DELETE TASK
app.delete("/deletetask", (req, res) => {
    const filter = {_id: req.body._id};

    Task.findOneAndDelete(filter).then((result)=>{
        res.send(result);
    });
})

app.listen(port, () => {
    console.log("App is running on port " + port);
});