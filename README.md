# async-factory

```js
const Factory = require('async-factory');
const factory = new Factory();

async function asyncGetter () {
  return 'something';
}

function foo () {
  let object = await factory.singleton('unique-object');
}

function bar () {
  let object = await factory.singleton('unique-object');
}

(async () => {
  factory.singleton('unique-object', asyncGetter);

  let [ one, two ] = await Promise.all([
    foo(),
    bar(),
  ]);

  assert.equal(one, two); // one and two is identical
})();


```
