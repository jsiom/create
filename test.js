var assert = require('assert/')
var Node = require('./node')
var Text = require('./text')
var create = require('./')

function app(data){
  return ['.app',
    ['h1#header', {onClick: console.log}, 'Todos'],
    ['ul#list', data.list.map(function(item, i){
      return ['li.item', {class: {selected: i == 1}}, item]
    })],
    ['#footer',
      ['p', 'Written by: ', new Text(data.author), null, undefined, [null]]]]
}

var vdom = create(app({
  author: 'Jake Rosoman',
  list: ['one', 'two', 'three']
}))

assert.equal(vdom, new Node('div', {className: 'app'}, [
  new Node('h1', {id: 'header'}, [new Text('Todos')], {click: console.log}),
  new Node('ul', {id: 'list'}, [
    new Node('li', {className: 'item'}, [new Text('one')]),
    new Node('li', {className: 'item selected'}, [new Text('two')]),
    new Node('li', {className: 'item'}, [new Text('three')])
  ]),
  new Node('div', {id: 'footer'}, [
    new Node('p', {}, [new Text('Written by: '), new Text('Jake Rosoman')])
  ])
]))

var c = 0
vdom.events.test = function(n){
  assert(this == vdom)
  c += n
}

vdom.emit('test', 1)
assert(c == 1)
