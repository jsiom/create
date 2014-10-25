var Text = require('./text')
var Node = require('./node')
var merge = require('merge')
var type = require('type')
var call = Function.call

/**
 * Convert a lispy array tree to virtual DOM nodes
 *
 * @param {Array} tree
 * @return {Node|Text}
 */

function toVDOM(tree){
  if (typeof tree == 'string') return new Text(tree)
  var head = tree[0]
  if (typeof head == 'function') return toVDOM(call.apply(head, tree))
  var head = parseTag(head)
  var tagName = head[0]
  var props = head[1]
  var children = tree.slice(1)
  if (type(children[0]) == 'object') merge(props, children.shift())
  var children = children.reduce(handleChild, [])
  return new Node(tagName, props, children)
}

function handleChild(arr, child){
  if (type(child[0]) == 'array') return child.reduce(handleChild, arr)
  arr.push(toVDOM(child))
  return arr
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
          props.className += ' ' + part.substr(1)
        } else {
          props.className = part.substr(1)
        }
        break
      case '#':
        props.id = part.substring(1)
    }
  }

  return [tagName, props]
}

module.exports = toVDOM
