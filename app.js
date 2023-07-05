const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/taskManagement")
    .then(() => console.log('MongoDB Connected!'));

const userSchema = new mongoose.Schema({ name: String, username: String, password: String })
const taskSchema = new mongoose.Schema({ title: String, desc: String, dueDate: Date, assignedUser: String })

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);


app.get("/", (req, res) => {
    res.send("Task Management Server");
});

// LOGIN 
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username }).then((foundUser) => {
        if (foundUser.password === password) {
            res.send("Login Successful");
        }
    });
})

// CREATE NEW USER
app.post("/register", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        name: name,
        username: username,
        password: password
    })

    newUser.save().then(console.log)
    res.send(newUser);
});

// CREATE NEW TASK
app.post("/addtask", (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const dueDate = req.body.dueDate;
    const assignedUser = req.body.assigned;

    const newTask = new Task({
        title: title,
        desc: desc,
        dueDate: dueDate,
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
    const filter = {title: "Title"};
    const update = {desc: "Desc Updated"};
    Task.findOneAndUpdate(filter, update).then((result)=>{
        res.send(result);
    });
})

app.listen(port, () => {
    console.log("App is running on port " + port);
});