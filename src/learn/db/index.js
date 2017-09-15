// const zango = require('zangodb');

class DB {
  static saveOptions(options) {
    localStorage.setItem('mathDrillOptions', JSON.stringify(options));
  }

  static getOptions() {
    const opts = localStorage.getItem('mathDrillOptions');
    return opts ? JSON.parse(opts) : opts;
  }
}

module.exports = DB;
