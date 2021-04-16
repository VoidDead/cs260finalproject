const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/magic', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a scheme for schools of magic
const schoolSchema = new mongoose.Schema({
  name: String,
  description: String
});

// Create a model for schools
const School = mongoose.model('School', schoolSchema);

// Create a school
app.post('/api/schools', async (req, res) => {
  const school = new School({
    name: req.body.name,
    description: req.body.description
  });
  try {
    await school.save();
    res.send(school);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all schools
app.get('/api/schools', async (req, res) => {
  try {
    let schools = await School.find();
    res.send(schools);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Schema for spells
const spellSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School'
    },
    title: String,
    description: String,
})

// Model for spells
const Spell = mongoose.model('Spell', spellSchema);

app.post('/api/schools/:schoolID/spells', async (req, res) => {
    try {
        let school = await School.findOne({_id: req.params.schoolID});
        if (!school) {
            res.send(404);
            return;
        }
        let spell = new Spell({
            school: school,
            title: req.body.title,
            description: req.body.description,
        });
        await spell.save();
        res.send(spell);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/schools/:schoolID/spells', async (req, res) => {
    try {
        let school = await School.findOne({_id: req.params.schoolID});
        if (!school) {
            res.send(404);
            return;
        }
        let spells = await Spell.find({school:school}).populate('school');
        res.send(spells);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/schools/:schoolID/spells/:spellID', async (req, res) => {
    try {
        let spell = await Spell.findOne({_id:req.params.spellID, school: req.params.schoolID});
        if (!spell) {
            res.send(404);
            return;
        }
        spell.description = req.body.description;
        spell.title = req.body.title;
        await spell.save();
        res.send(spell);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/schools/:schoolID/spells/:spellID', async (req, res) => {
    try {
        let spell = await Spell.findOne({_id:req.params.spellID, school: req.params.schoolID});
        if (!spell) {
            res.send(404);
            return;
        }
        await spell.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/schools/:schoolID', async (req, res) => {
    try {
        let school = await School.findOne({_id:req.params.schoolID});
        if (!school) {
            res.send(404);
            return;
        }
        await school.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3001, () => console.log('Server listening on port 3000!'));