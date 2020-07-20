import { Router } from "express";
import passport from 'passport';
import {forwardAuthenticated} from '../lib/authenticate';
const router = Router();


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admin/auth/login');
});

export default router;

