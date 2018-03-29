const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


// Load idea model
require('../models/idea');
const Idea = mongoose.model('ideas');


// Idea Index Page
router.get('/', (req, res) => {
  const title = 'List of ideas'
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        title: title,
        ideas: ideas
      })
    })

});

// add Idea form
router.get('/add', (req, res) => {
  const {
    titleLabel,
    detailLabel
  } = addLabels();
  res.render('ideas/add', {
    titleLabel: titleLabel,
    detailLabel: detailLabel
  });
});

// Edit Idea form
router.get('/edit/:id', (req, res) => {
  const {
    titleLabel,
    detailLabel
  } = editLabels();
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea,
        titleLabel: titleLabel,
        detailLabel: detailLabel
      })
    })
});

// Process form
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title.'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details.'
    })
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg','Video idea added.');
        res.redirect('ideas/')
      })
  }
});

// Edit Form Process
try {
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then( idea => {
      req.flash('success_msg','Video idea updated.');
      res.redirect('./');
    });
  });
});
} catch(err) {
  res.send (err);
}


// Delete idea
router.delete('/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
  .then(() => {
    req.flash('success_msg','Video idea removed.');
    res.redirect('./');
  });
});
function addLabels() {
  const titleLabel = 'Title';
  const detailLabel = 'Provide details';
  return {
    titleLabel,
    detailLabel
  };
};

function editLabels() {
  const titleLabel = 'Edit Title';
  const detailLabel = 'Edit Details';
  return {
    titleLabel,
    detailLabel
  };
};

module.exports = router;