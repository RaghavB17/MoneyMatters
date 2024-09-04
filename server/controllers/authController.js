const User = require('../models/User');
const jwt = require('azure-ad-jwt');

exports.authenticateUser = async (req, res) => {
  const token = req.header('Authorization').split(' ')[1];

  jwt.verify(token, null, (err, result) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    User.findOne({ _id: result.oid }, (err, user) => {
      if (user) {
        // If user exists, return user data
        return res.json(user);
      }

      // If user doesn't exist, create a new one
      const newUser = new User({
        _id: result.oid,
        email: result.email,
        username: result.name, // Assuming result.name is used as the username
        firstName: result.firstName || '', // Use empty string if not provided
        lastName: result.lastName || '', // Use empty string if not provided
        phoneNumber: result.phoneNumber || '', // Use empty string if not provided
      });

      newUser
        .save()
        .then((user) => res.json(user))
        .catch((error) => res.status(500).json({ error: error.message }));
    });
  });
};
