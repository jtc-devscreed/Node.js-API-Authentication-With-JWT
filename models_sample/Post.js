const path = require('path')
const postPath = path.resolve(__dirname, '..', 'fixtures', 'posts.json');
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const readFilePromise = Promise.promisify(fs.readFile)
const User = require('./User');
const user = new User();

function _fetchPosts () {
  return readFilePromise(postPath, 'utf-8')
  .then((posts) => {
    return JSON.parse(posts);
  })
  .catch((err) => {
    throw err;
  });
}

class Post {
  constructor() {
    this._fetchPosts = Promise.resolve([]);
  }

  find() {
    this._fetchPosts = _fetchPosts();
    return this;
  }

  populate (modelName = 'User') {
    this._fetchPosts = this._fetchPosts
      .then((fps) => {
        const models = require('../models_sample');
        const model = new models[modelName]
        const firstChar = modelName[0];
        const modelIdName = '_' + firstChar.toLowerCase() + modelName.substring(1);
        return Promise.mapSeries(fps, async (fp) => {
          const u = await model.findById(fp[modelIdName]).exec();
          fp._user = u;
          return fp;
        })
      });

    return this;
  }

  exec () {
    return this._fetchPosts;
  }
}

module.exports = Post;