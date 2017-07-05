const Factory = require('../index');
const assert = require('assert');

describe('factory', () => {
  let factory;

  beforeEach(() => {
    factory = new Factory();
  });

  describe('factory#singleton', () => {
    it('produce singleton by key', async () => {
      let foo;
      let fooFactory = async () => {
        if (foo) {
          return foo;
        }

        return new Promise(resolve => {
          setTimeout(() => {
            foo = 'foo-data';
            resolve(foo);
          }, 500);
        });
      };

      let fooz = await factory.singleton('foo', fooFactory);

      assert.equal(foo, fooz);
    });

    it('produce singleton by function', async () => {
      let foo;
      let fooFactory = async () => {
        if (foo) {
          return foo;
        }

        return new Promise(resolve => {
          setTimeout(() => {
            foo = 'foo-fn';
            resolve(foo);
          }, 500);
        });
      };

      let fooz = await factory.singleton(fooFactory);

      assert.equal(foo, fooz);
    });

    it('produce and wait singleton', async () => {
      let foo;
      let fooFactory = async () => {
        if (foo) {
          return foo;
        }

        return new Promise(resolve => {
          setTimeout(() => {
            foo = 'foo-wait';
            resolve(foo);
          }, 500);
        });
      };

      let manyFoos = [];
      for (let i = 0; i < 10; i++) {
        manyFoos.push(factory.singleton(fooFactory));
      }
      let foos = await Promise.all(manyFoos);

      foos.forEach(fooz => {
        assert.equal(foo, fooz);
      });
    });
  });
});
