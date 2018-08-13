const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')

router.post('/local', (req, res) => {
    console.log('local user signup', req.body.user);

    const { email, password, username } = req.body.user
    // ADD VALIDATION
    User.findOne({ 'local.email': email }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the email: ${email}`
            })
        }
        else {
            const newUser = new User()

            newUser.local.email = email
            newUser.local.password = password
            newUser.local.username = username

            console.log(newUser)

            newUser.save((err, savedUser) => {
                if (err) {
                    console.log(err)
                    return res.json(err)
                }
                console.log(savedUser)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/local/login',
    function (req, res, next) {
        console.log('req.body:');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        const userInfo = {
            user: req.user
        };
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({})
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        console.log("loggin user out on Server")
        res.send({ msg: 'logging out' })

    } else {
        res.send({ msg: 'no user to log out' })
    }
})


// send to google to do the authentication
router.post('/google/login', passport.authorize('google', { scope: ['profile', 'email'] }));

// the callback after google has authorized the user
router.get('/auth/google/callback',
    passport.authorize('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

module.exports = router