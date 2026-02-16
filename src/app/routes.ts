import { Router } from 'express';
import {
  signup,
  login,
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getCampaignPage,
  renderPreview,
} from './controllers';

const router = Router();

// Auth routes
router.post('/api/signup', signup);
router.post('/api/login', login);

// Contact API routes
router.get('/api/contacts', getAllContacts);
router.post('/api/contacts', createContact);
router.put('/api/contacts/:contactId', updateContact);
router.delete('/api/contacts/:contactId', deleteContact);

// View routes
router.get('/contacts', (req, res) => {
  res.render('contacts');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.get('/campaigns', getCampaignPage); // The UI
router.post('/api/render-preview', renderPreview); // The "Live Feed" engine
// router.post('/api/campaigns', createCampaign); // Save/Send

export default router;
