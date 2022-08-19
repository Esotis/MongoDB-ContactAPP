const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Jovan:jovan123@clustertesting.5iaxchf.mongodb.net/testing?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
