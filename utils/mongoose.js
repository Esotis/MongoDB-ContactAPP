const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://YourAccount:YourPassword@YourCluster.5iaxchf.mongodb.net/testing?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
