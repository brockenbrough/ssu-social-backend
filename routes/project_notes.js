const express = require("express");

// projectNotesRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /project_notes.
const projectNotesRoutes = express.Router();

// Load Developer model
const Developer = require('../models/contributorModel');

projectNotesRoutes.get('/project_notes/contributor', (req, res) => {
  Developer.find()
    .then(developers => res.json(developers))
    .catch(err => res.status(404).json({ nobooksfound: 'No developers found' }));
});

projectNotesRoutes.get('/project_notes/contributor/:id', (req, res) => {
  Developer.findById(req.params.id)
    .then(developer => res.json(developer))
    .catch(err => res.status(404).json({ developernotfound: 'No developer found' }));
});

projectNotesRoutes.post('/project_notes/contributor/add', (req, res) => {
  Developer.create(req.body)
    .then(developer => res.json({ msg: 'Developer added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this developer' }));
});

projectNotesRoutes.put('/project_notes/contributor/update/:id', (req, res) => {
  Developer.findByIdAndUpdate(req.params.id, req.body)
    .then(developer => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

projectNotesRoutes.delete('/project_notes/contributor/:id', (req, res) => {
  Developer.findByIdAndRemove(req.params.id, req.body)
    .then(developer => res.json({ mgs: ' entry deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such developer' }));
});

module.exports = projectNotesRoutes;
