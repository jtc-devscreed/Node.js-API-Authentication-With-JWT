function verifyToken (req, res, next) {
  const token = req.token;

  return req.jwt.verifyAsync(token, 'secretkey')
    .then(authData => {
      req.auth = authData;
      next();
    })
    .catch(err => {
      return res.status(400).send({
        status: 'ERROR',
        status_code: 102,
        http_code: 400,
        status_message: 'Invalid token'
      })
    });
}

function fetchToken (req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
  } else {
      // Forbidden
      // sample standard response
      res.status(403).send({
        status: 'ERROR',
        status_code: 103,
        http_code: 403,
        status_message: 'Unauthorized user'
      });
  }
}

function login (req, res, next) {
  const email = req.body.email;

  return req.db.User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          status: 'ERROR',
          status_code: 102,
          http_code: 400,
          status_message: 'Invalid credentials'
        })
      }

      req.user = user;
      return next();
    })
    .catch(err => {
      res.status(500).send({
        status: 'ERROR',
          status_code: 100,
          http_code: 500,
          status_message: 'Internal server error'
      });
    });
}

function signToken (req, res, next) {
  const user = req.user;
  return req.jwt.signAsync({user}, 'secretkey', { expiresIn: '60s' })
    .then(token => {
      res.status(200).send({
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        token: token
      });
    })
    .catch(err => {
      res.status(500).send({
        status: 'ERROR',
          status_code: 100,
          http_code: 500,
          status_message: 'Internal server error'
      });
    });
}

module.exports = {
  fetchToken,
  verifyToken,
  login,
  signToken
};
