const express = require('express');
const connectDB = require('./config/db');


const app = express();

//connect database 
connectDB();

//Body-Parser
app.use(express.json({ extended: false }));

app.get('/',(req, res) => res.send('API Rnning'));

//define routes
app.use('/users',require('./routes/api/users'));
app.use('/auth',require('./routes/api/auth'));
app.use('/profile',require('./routes/api/profile'));
app.use('/posts',require('./routes/api/posts'));

//localhost
const PORT = process.env.PORT || 1000;
app.listen(PORT,() => 
console.log('Server started on port ${PORT}')
);