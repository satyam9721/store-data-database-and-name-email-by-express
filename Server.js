const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb://0.0.0.0:27017/Land'; // Replace with your MongoDB connection URI and Database name is Land and collecction would be submissions
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Submission = mongoose.model('Submission', {
  fullName: String,
  email: String,
  contactNo: String,
  message: String,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/submit', async (req, res) => {
  const { fullName, email, contactNo, message } = req.body;

  try {
    const submission = new Submission({
      fullName,
      email,
      contactNo,
      message,
    });

    await submission.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting data' });
  }
});

app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving submissions' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
