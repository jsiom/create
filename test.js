var assert = require('assert/')
var Node = require('./node')
var Text = require('./text')
var create = require('./')

function app(data){
  return ['.app',
    ['h1#header', 'Todos'],
    ['ul#list', data.list.map(function(item){
      return ['li.item', item]
    })],
    ['#footer',
      ['p', 'Written by: ', data.author]]]
}

var vdom = create(app({
  author: 'Jake Rosoman',
  list: ['one', 'two', 'three']
}))

assert.equal(vdom, new Node('div', {className: 'app'}, [
  new Node('h1', {id: 'header'}, [new Text('Todos')]),
  new Node('ul', {id: 'list'}, [
    new Node('li', {className: 'item'}, [new Text('one')]),
    new Node('li', {className: 'item'}, [new Text('two')]),
    new Node('li', {className: 'item'}, [new Text('three')])
  ]),
  new Node('div', {id: 'footer'}, [
    new Node('p', {}, [new Text('Written by: '), new Text('Jake Rosoman')])
  ])
]))
