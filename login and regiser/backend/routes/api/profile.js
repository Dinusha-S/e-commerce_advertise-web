const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth.middleware');
const { populate } = require('../../models/profile.model');
const Profile = require('../../models/profile.model');
const User = require('../../models/user.model');
const {check ,validationResult} = require('express-validator');

// @route   GET api/profile/me
// @desc    Get Current Users
// @access  Private
router.get('/me',auth, async (req,res) => {
  try{
    const profile = await Profile.findOne({user : req.user.id}).populate('user',['username','userID','email','avatar']);

    if(!profile) {
        return res.status(400).json({msg: 'there is no profile for this user'})
    }
    res.json(profile);
  }catch(err){
      console.err(err.message);
      res.status(500).send('server error');
  }
});

// @route   post api/profile
// @desc    Create or update profile
// @access  Private
router.post('/',[ auth,
    [
    check('mobile', 'number is required')
    .not()
    .isEmpty()
]
],
async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {mobile, description} = req.body;

    //build profile object
    const profilefields ={};
    profilefields.user = req.user.id;
    if(mobile) profilefields.mobile = mobile ;
    if(description) profilefields.description = description;

    // console.log(profilefields);
    
    try {
       let profile = await Profile.findOne({user : req.user.id});

       if(profile){
           // Update
           profile = await Profile.findOneAndUpdate(
               {user : req.user.id} ,
               {$set : profilefields},
               {new : true}
               );
            return res.json(profile);   
       }
       //create
       profile = new Profile(profilefields);

       await profile.save();
       res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});



module.exports = router;