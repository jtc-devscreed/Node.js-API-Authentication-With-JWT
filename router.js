// sample route implementation
const handlers = require('./handlers');

module.exports = (app) => {
  app.post('/api/login',
    handlers.authentication.login,
    handlers.authentication.signToken
  );

  app.get('/api', (req, res) => {
    res.json ({
        message: 'Welcome to the API'
    });
  });

  app.get('/api/posts', 
    handlers.authentication.fetchToken,
    handlers.authentication.verifyToken, 
    handlers.posts.getPosts
  );

};
