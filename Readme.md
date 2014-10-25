
# create

  Syntax sugar for creating virtual DOM nodes inspired by [weavejester/hiccup](https://github.com/weavejester/hiccup/wiki/Syntax).

## Installation

With [packin](//github.com/jkroso/packin): `packin add jsiom/create`

then in your app:

```js
var Text = require('create/text')
var Node = require('create/node')
var create = require('create')
```

## API

### `create(text::String)`

```js
create('a text node') // => new Text('a text node')
```

### `create(tree::Array)`

`tree` is a lisp like structure built out of `Array`'s. The first item in the `tree` always refers to the type of node it represents. It can be either a `String` or a `Function`:

```js
create(['p']) // => new Node('p')
create([function(){ return ['p'] }]) // => new Node('p')
```

The second item in the `tree` can optionally be an `Object`. In which case it will be merged with the properties of the returned virtual DOM node:

```js
create(['p', {className: 'aclass'}]) // => new Node('p', {className:'aclass'})
```

Its very common to define `className` and `id` properties on a node so to make this easier you can define them in the head of the `tree`:

```js
create(['p.aclass']) // => new Node('p', {className:'aclass'})
create(['p#anID']) // => new Node('p', {id:'anID'})
create(['p#id.and.several.classes']) // => new Node('p', {id:'id',className:'and several classes'})
create(['#implicit.div']) // => new Node('div', {id: 'implicit', className:'div'})
```

The remaining items in the `tree` are then used as the children of the returned virtual DOM node:

```js
create(['p', 'a text node']) // => new Node('p', {}, [new Text('a text node')])
create(['p', ['a'], ['b']]) // => new Node('p', {}, [new Node('a'), new Node('b')])
create(['p', {id: 'anID'}, ['a']]) // => new Node('p', {id: 'anID'}, [new Node('a')])
```

`create` will also unwrap any exessively nested `Arrays`. This allows you to easily use `map` to produce the children of a node.

```js
create(['ul', [1,2,3].map(function(item){
  return ['li', String(item)]
})]) // => create(['ul', ['li', '1'], ['li', '2'], ['li', '3']])
```
