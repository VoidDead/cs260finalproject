const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

// Create a scheme for schools of magic
const schoolSchema = new mongoose.Schema({
	name: String,
	description: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
});

// Create a model for schools
const School = mongoose.model('School', schoolSchema);

// Create a school
router.post('/', validUser, async (req, res) => {
  const school = new School({
    name: req.body.name,
    description: req.body.description,
	user: req.user,
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
router.get('/', async (req, res) => {
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
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
    title: String,
    description: String,
	firstName: String,
	lastName: String,
	path: String,
	created: {
		type: Date,
		default: Date.now
	},
})

// Model for spells
const Spell = mongoose.model('Spell', spellSchema);

router.post('/:schoolID/spells', validUser, async (req, res) => {
    try {
		let school = await School.findOne({_id: req.params.schoolID});
        if (!school) {
            res.send(404);
            return;
        }
        let spell = new Spell({
            school: school,
			user: req.user,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
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

router.get('/:schoolID/allSpells', async (req, res) => {
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

router.get('/:schoolID/spells', validUser, async (req, res) => {
    try {
        let school = await School.findOne({_id: req.params.schoolID});
        if (!school) {
            res.send(404);
            return;
        }
        let spells = await Spell.find({school:school, user: req.user}).populate('school');
        res.send(spells);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/:schoolID/spells/:spellID', async (req, res) => {
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

router.delete('/:schoolID/spells/:spellID', async (req, res) => {
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

router.delete('/:schoolID', async (req, res) => {
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


module.exports = {
  routes: router,
  model: School,
  model: Spell,
};