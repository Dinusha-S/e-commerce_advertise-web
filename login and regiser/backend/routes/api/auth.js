const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth.middleware');
const User = require('../../models/user.model');

// @route   GET api/users
// @desc    Register user
// @access  Public
router.get('/',auth,async (req,res) =>
{
    try{
       const user = await User.findById(req.user.id).select('-password');
       res.json(user);
    }catch(err){
      console.error(err.message);
      res.status(500).send('server error');
    }
} 
);

// @route   GET api/users
// @desc    auth user & get token
// @access  Public
router.get('/',(req,res) => res.send('user router'));

router.post('/',[
    check('userID','id required').exists(),
    //check('email' , 'enter valid email').isEmail(),
    check('password required' , 'pass requ').exists()
],
async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {userID ,password} = req.body;

    try{
    //if user exists
    let user = await User.findOne({email});

    if(!user) {
        return res.status(400).json({error :[{ msg :'Invalid'}]})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({error ({})})
    }


    //Return jsonwebtoken
    const payload = {
        user :{
            id : user.id
        }
    }

    jwt.sign(payload, config.get('jwtToken'),
    {expiresIn :360000},
    (err,token) => {
        if(err) throw err;
        res.json({token});

    }
     );
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }    
});

module.exports = router;