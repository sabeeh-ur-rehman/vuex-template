import { Router } from 'express';
import auth from '../src/routes/auth';
import tenants from '../src/routes/tenants';
import users from '../src/routes/users';
import memberships from '../src/routes/memberships';
import customers from '../src/routes/customers';
import projects from '../src/routes/projects';
import steps from '../src/routes/steps';
import priceLists from '../src/routes/priceLists';
import proposals from '../src/routes/proposals';
import variations from '../src/routes/variations';
import emails from '../src/routes/emails';
import templates from '../src/routes/templates';
import admin from '../src/routes/admin';

const router = Router();

router.use('/auth', auth);
router.use('/tenants', tenants);
router.use('/users', users);
router.use('/memberships', memberships);
router.use('/customers', customers);
router.use('/projects', projects);
router.use('/steps', steps);
router.use('/price-lists', priceLists);
router.use('/proposals', proposals);
router.use('/variations', variations);
router.use('/emails', emails);
router.use('/templates', templates);
router.use('/admin', admin);

router.get('/health', (_req, res) => {
  res.send('ok');
});

export default router;
