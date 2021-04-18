const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/user.model');

// @route   GET api/users
// @desc    Register user
// @access  Public
router.get('/',(req,res) => res.send('user router'));

router.post('/',[
    check('username' , 'name is required').not().isEmpty(),
    check('userID','enter ur uni ID').isLength({min:8},{max:9}),
    check('email' , 'enter valid email').isEmail(),
    check('password' , 'enter more  than 6 char').isLength({min:6})
],
async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {username, userID, email ,password} = req.body;

    try{
    //if user exists
    let user = await User.findOne({email});

    if(user) {
        return res.status(400).json({error :[{ msg :'user already exists'}]})
    }

    //Get users gravator
    const avatar = gravatar.url(email,{
        s : '200',
        r : 'pg',
        d : 'mm'//https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg
    })

    user =  new User({
        username,
        userID,
        email,
        avatar,
        password
    });


    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password , salt);

    await user.save();


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