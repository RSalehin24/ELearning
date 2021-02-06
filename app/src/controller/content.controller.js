const Course = require("../model/course.model");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb://localhost/e-learning';
const conn = mongoose.createConnection(mongoURI);
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


exports.insertFileName = (req, res) => {
  Course.update(
    {courseID: req.body.courseID},
    {$push: {"contentID": req.file.filename}}
    ).exec(async (error, user) => {
    if (error) return res.status(400).json({ message: error });
    if (user) {
      return res.json({user: user});
    } else {
      return res.status(200).json({ message: "no user" });
    }
  });  
};

exports.readFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

   else{
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
};

exports.deleteFile = (req, res) => {
  gfs.remove({ filename: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/files');
  });
};

exports.getAllFiles = (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    return res.json(files);
  });
};

exports.getSingleFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    return res.json(file);
  });
};