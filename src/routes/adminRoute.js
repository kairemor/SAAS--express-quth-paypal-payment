import { Router } from "express";
import moment from "moment";
import {ensureAuthenticated} from '../lib/authenticate';
import Model from '../models';
import { findAll, create} from "../services";
import { validateEmail, 
  sendMailConfirmation, 
  validatePassword, 
  validateFieldLength, 
} from "../lib/utils";
import { findOrCreate } from "../services";
import { hashPassword } from "../lib/passwordOp";

const { User, Group } = Model; 
const router = Router();

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('index', {
    user: req.user
  })
);
// Users
router.get('/users', ensureAuthenticated, async(req, res) => {
  const users = await findAll(User)
  res.render('users', {
    users: users,
    moment: moment
  })
  }
);

router.get('/create-user', ensureAuthenticated, async(req, res) => {
  res.render('addUser', {})
  }
);


//
router.post('/create-user', ensureAuthenticated, async(req, res) => {
  console.log(req.body);
  if (!validatePassword(req.body.password)) {
    req.flash('error_msg', 'Password length should be more than 8 characters');
    return res.redirect('/admin/create-user')
  }

  if (req.body.password != req.body.confirmPassword) {
    req.flash('error_msg', 'password and passwordConfirm are not the same');
    return res.redirect('/admin/create-user')
  }

  if (!validateFieldLength(req.body.firstName, req.body.lastName)) {
    req.flash('error_msg', 'firstName and lastName length should be less than 50 characters');
    return res.redirect('/admin/create-user')
    
  }

  const password = await hashPassword(req.body.password);

  const email = req.body.email.toLowerCase();

  if (!validateEmail(email)) {
    req.flash('error_msg', 'email is not correct');
    return res.redirect('/admin/create-user')
  }

  const [account, created] = await findOrCreate(User, {
    ...req.body,
    password,
    email
  });
  
  if (!created) {
    req.flash('error_msg', 'user with email already exist');
    return res.redirect('/admin/create-user')
  }

  try {
    const host = req.get('host')
    const protocole = req.protocol
    const token = getToken(account.toJSON())
    const link = `${protocole}://${host}/api/v1/auth/validate/?key=${token}`
    await sendMailConfirmation(account.toJSON().email, account.toJSON().firstName, link)
  } catch (error) {
    
  }

  req.flash('success_msg', 'User created check email to validate or validate hear');
  return res.redirect('/admin/users')

}) 

// group
router.get('/group', ensureAuthenticated, async(req, res) => {
  const groups = await findAll(Group)
  res.render('groups', {
    groups: groups
  })
  }
);

router.get('/create-group', ensureAuthenticated, async(req, res) => {
  res.render('addGroup')
})

router.post('/create-group', ensureAuthenticated, async(req, res) => {
  await create(Group, req.body)
  res.redirect('/admin/group')
})
export default router;
