import { Router } from "express";
import {ensureAuthenticated} from '../lib/authenticate';
import * as authentication from "../lib/authenticate";


const router = Router();

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('index', {
    user: req.user
  })
);

export default router;
