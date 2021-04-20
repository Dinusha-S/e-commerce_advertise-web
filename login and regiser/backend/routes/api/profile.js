const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth.middleware');
const { populate } = require('../../models/profile.model');
const Profile = require('../../models/profile.model');
const User = require('../../models/user.model');

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

module.exports = router;