const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
},  
{ collection: "contributors" });

// contributor is the name of the collection in mongodb
module.exports = Developer = mongoose.model('contributors', ContributorSchema)