const path = require('path')
const userPath = path.resolve(__dirname, '..', 'fixtures', 'users.json');
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const readFilePromise = Promise.promisify(fs.readFile)

function _fetchUsers () {
  return readFilePromise(userPath, 'utf-8')
    .then((users) => {
      return JSON.parse(users);
    })
    .catch((err) => {
      throw err;
    });
}

class User {
  constructor () {
    this._fetchUsers = _fetchUsers()
    // initialization is triggered here
  }

  find(where) {
    this._fetchUsers = _fetchUsers()
      .then(users => {
        if (!where) return users
        if (where && where.school) {
          return _.filter(users, (user) => user.school === where.school);
        }else if (where && where.email) {
          return _.filter(users, (user) => user.email === where.email);
        } else {
          return users;
        }
        // can do more filters here
      });

    return this;
  }

  findOne(where) {
    this._fetchUsers = _fetchUsers()
      .then(users => {
        let urs = [];
        if (!where) return null
        if (where && where.school) {
          urs = _.filter(users, (user) => user.school === where.school);
        }else if (where && where.email) {
          urs = _.filter(users, (user) => user.email === where.email);
        } else {
          return null;
        }
        if (urs.length > 0) {
          return urs[0]
        } else {
          return null;
        }
        // can do more filters here
      });

    return this;
  }

  findById(userId) {
    if (!userId) throw {error: 'No user Id'};
    this._fetchUsers = _fetchUsers()
      .then(users => {
        return _.find(users, (user) => user.id === userId);
      });
    
    return this;
  }

  exec () {
    return this._fetchUsers;
  }
}

module.exports = User;
