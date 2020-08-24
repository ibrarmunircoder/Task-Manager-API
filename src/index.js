const express = require('express');
require('../utils/connect');
const User = require('../models/user');
const Task = require('../models/task');
const userRoutes = require('../routes/user');
const taskRoutes = require('../routes/task');

const app = express();

// const port = process.env.PORT || 3000;
const port = process.env.PORT

app.use(express.json()); //parse incoming JSON data into JavaScript Object

app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log('Server is up on ', port);
});

const multer = require('multer');

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a pdf file'));
        // }
        // cb(undefined, true);
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document.'));
        }
        cb(undefined, true);
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});
// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'ibrar123'}, 'thisismyfirstnodejscourse', {expiresIn: '5 seconds'});
//     console.log(token);
//     const data = jwt.verify(token, 'thisismyfirstnodejscourse');
//     console.log(data);
// }
// myFunction();

// const bcrypt = require('bcryptjs');

// const myFunction = async () => {
//     const password = 'EdxCoder007';
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare(password, hashedPassword);
//     console.log(isMatch);
// }

// myFunction();


// // 
// // without middleware: new request -> route handler
// // 
// // with middlwware: new request -> do something -> route handler

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         return res.send('GET request are disables')
//     }
//     next();
// });

// // Goal: Setup middleware for maintenance mode
// // 1- register a new middleware
// // 2- send back a maintenance message with a 503 status code
// // 3- test your work from postman
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back Soon');
// });

// // Relationship
// const taskMain = async () => {
//     const task = await Task.findById('5f3e251be888ac4724d78e5b');
//     await task.populate('owner').execPopulate();
//     // populate is going to figure out which user created
//     //  which tasks or which tasks a user owns
//     // Simply it is going to find a user who is associated with that task.
//     console.log(task.owner);
// };
// taskMain();

// const userMain = async () => {
//     const user = await User.findById('5f3e23bccb420a1fdc53bb81');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// };

// userMain();