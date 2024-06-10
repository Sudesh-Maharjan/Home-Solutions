const express = require('express');
const { addContact, getContacts, deleteContact } = require('../controllers/contactController');
const router = express.Router();


router.post('/addcontact', addContact)
router.get('/contactlist', getContacts)
router.delete('/deletecontact/:id', deleteContact)

module.exports=router