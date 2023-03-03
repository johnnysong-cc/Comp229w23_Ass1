const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNSTRING,
  { useNewUrlParser: true, useUnifiedtopology: true },
  (err) => {
    if (err) console.error("Error connecting to MongoDB:", err);
    else console.log('Connected to MongoDB.');
  });
mongoose.connection.on('error', console.error.bind(console, 'connection Error:'));

module.exports = mongoose;