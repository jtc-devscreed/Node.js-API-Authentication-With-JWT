function getPosts (req, res, next) {
  return req.db.Post.find()
    .populate()
    .exec()
    .then(posts => {
      res.status(200).send({
        status: 'SUCCESS',
        status_code: 0,
        http_code: 200,
        posts
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
  getPosts
};