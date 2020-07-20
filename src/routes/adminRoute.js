import { Router } from "express";
import {ensureAuthenticated} from '../lib/authenticate';
import Model from '../models';
import { findAll } from "../services";

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
    users: users
  })
  }
);

router.get('/create-user', ensureAuthenticated, async(req, res) => {
  res.render('addUser', {})
  }
);

// group
router.get('/group', ensureAuthenticated, async(req, res) => {
  const groups = await findAll(Group)
  res.render('users', {
    groups: groups
  })
  }
);

export default router;
