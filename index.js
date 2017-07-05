class Space {
  constructor (fn) {
    this.fn = fn;
    this.locks = [];
    this.done = false;
  }

  async fetch () {
    if (!this.done) {
      await new Promise(async (resolve, reject) => {
        this.locks.push([ resolve, reject ]);

        if (this.locks.length > 1) {
          return;
        }

        try {
          let { fn } = this;
          this.value = await fn();
        } catch (err) {
          this.error = err;
        }

        this.done = true;
        this.locks.splice(0).forEach(([ resolve, reject ]) => {
          if (this.error) {
            reject(this.error);
          } else {
            resolve(this.value);
          }
        });
      });
    }

    if (this.error) {
      throw this.error;
    }

    return this.value;
  }
}

class Factory {
  constructor () {
    this.spaces = new Map();
  }

  async singleton (key, fn) {
    fn = fn || key;

    let space;
    if (this.spaces.has(key)) {
      space = this.spaces.get(key);
    } else {
      space = new Space(fn);
      this.spaces.set(key, space);
    }

    return space.fetch(); // return promise
  }
}

module.exports = Factory;
