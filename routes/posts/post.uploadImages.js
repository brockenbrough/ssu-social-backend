const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')
require("dotenv/config")                      

// multer will be used to handle the form data.
// aws-sdk library will used to upload image to s3 bucket.
const multer = require('multer')              
const Aws = require('aws-sdk')               
require("dotenv/config")                      


// creating the storage variable 
// if nothing is provided in the callback it will get uploaded in main directory

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

//check the type of file which is uploaded

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,            
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY      
})

router.post("/posts/postImages",upload.single('postImage'), async (req, res) => { 
    // to check the data in the console that is being uploaded
    console.log(req.file)  
    
    const params = {
        Bucket:process.env.BUCKET_NAME,      
        Key:req.file.originalname,            
        Body:req.file.buffer,                
        ACL:"public-read",                
        ContentType:"image/png"          
    };
  
   // uplaoding the photo using s3 instance and saving the link in the database.
    
    s3.upload(params,(error,data)=>{
        if(error){
            res.status(500).send({"err":error}) 
        }
  
    console.log(data)
    
   // saving the information in the database.   
    const posts = new newPostModel({
            username: req.body.username,
            content: req.body.content,
            postImage: req.file.location
        });
        posts.save()
            .then(result => {
                res.status(200).send({
                    _id: result._id,
                    username: result.username,
                    content: result.content,
                    postImage: data.Location,
                })
            })
            .catch(err => {
                res.send({ message: err })
          })
    })
})
module.exports = router;