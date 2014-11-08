var ThunkNode = require('thunk-node')
var Text = require('./text')
var Node = require('./node')
var type = require('type')

/**
 * Convert a lispy array tree to virtual DOM nodes
 *
 * @param {Array} tree
 * @return {Node|Text}
 */

function toVDOM(tree){
  switch (type(tree)) {
  case 'string': return new Text(tree)
  case 'object': return tree
  case 'array':
    if (typeof tree[0] == 'function') return new Thunk(tree)
    var head = parseTag(tree[0])
    var tagName = head[0]
    var props = head[1]
    var children = tree.slice(1)
    if (type(children[0]) == 'object') {
      var properties = children.shift()
      for (var key in properties) {
        var value = properties[key]
        var isevent = /^on([A-Z][a-z]+$)/.exec(key)
        if (isevent) {
          var events = events || {}
          events[isevent[1].toLowerCase()] = value
        } else if (key == 'class') {
          for (key in value) if (value[key]) {
            props.className = props.className
              ? props.className + ' ' + key
              : key
          }
        } else {
          props[key] = properties[key]
        }
      }
    }
    var children = children.reduce(handleChild, [])
    return new Node(tagName, props, children, events)
  default: throw new Error('can\'t create virtual dom from "' + type(tree) + '"')
  }
}

/**
 * Add the rendered form of child to an array
 *
 * @param {Array} arr
 * @param {Any} child
 * @return {Array}
 */

function handleChild(arr, child){
  switch (type(child)) {
  case 'array':
    if (!child.length) break
    if (type(child[0]) == 'array') return child.reduce(handleChild, arr)
  case 'string':
  case 'object':
    arr.push(toVDOM(child))
  }
  return arr
}

/**
 * A specialized Thunk which provides an implicit `toVDOM` while
 * preserving equality between Thunk instances
 *
 * @param {Array} tree
 */

function Thunk(tree) {
  this.arguments = tree.slice(1)
  this.fn = tree[0]
  this.cache = null
}

Thunk.prototype = Object.create(ThunkNode.prototype)
Thunk.prototype.constructor = Thunk

Thunk.prototype.render = function() {
  return toVDOM(this.fn.apply(this, this.arguments))
}

/**
 * Parse a string into [tagName, className, ID]
 *
 * @param {String} tag
 * @return {Array}
 */

function parseTag(tag) {
  var parts = tag.split(/([\.#][^.#\s]+)/)
  var tagName = parts[0] || 'div'
  var props = {}

  for (var i = 1, l = parts.length; i < l; i++) {
    var part = parts[i]
    switch (part.charAt(0)) {
      case '.':
        if (props.className) {
          props.className += ' ' + part.substring(1)
        } else {
          props.className = part.substring(1)
        }
        break
      case '#':
        props.id = part.substring(1)
    }
  }

  return [tagName, props]
}

module.exports = toVDOM
