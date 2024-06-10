const Contact= require('../models/contactModel')
exports.addContact = async (req, res) => {
  try {
    const { fullName, email, contactNumber, message } = req.body;
    console.log('this is req.body: ', req.body)
    // Create a new contact using the Sequelize model
    const contact = await Contact.create({
      fullName,
      email,
      contactNumber,
      message,
    });

    if (!contact) {
      return res.status(400).json({ error: 'Failed to send the contact message.' });
    }
    res.status(201).json({ message: 'Contact message sent successfully.', contact });
  } catch (error) {
    // Log the error for debugging purposes
    console.log(error);

    if (error.name === 'SequelizeValidationError') {
      // Handle validation errors
      const validationErrors = {};
      error.errors.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      res.status(400).json({ errors: validationErrors });
    } else {
      console.log(error)
      res.status(500).json({ error: 'An error occurred while saving the contact message' });
    }
  }
};


exports.getContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.limit) || 4;

  if (page <= 0 || itemsPerPage <= 0) {
    return res.status(400).json({ message: 'Invalid page or limit parameters.' });
  }
  const offset = (page - 1) * itemsPerPage;

  try {
    const contacts = await Contact.findAndCountAll({
      offset,
      limit: itemsPerPage,
    });

    if (!contacts || contacts.count === 0) {
      return res.status(404).json({ message: 'No contact messages found.' });
    }

    const totalContacts = contacts.count;
    const totalPages = Math.ceil(totalContacts / itemsPerPage);

    return res.status(200).json({ contacts: contacts.rows, totalContacts, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while getting the list of contact messages.' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const deletedContact = await Contact.destroy({
      where: { id: contactId },
    });

    if (deletedContact === 0) {
      return res.status(404).json({ error: 'Contact message with that id not found.' });
    }

    return res.status(200).json({ message: 'Contact message deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
