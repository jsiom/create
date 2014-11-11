var call = Function.call
var emptyArray = []
var emptyMap = {}

function VirtualNode(tagName, properties, children, events) {
  this.tagName = tagName
  this.properties = properties || emptyMap
  this.children = children || emptyArray
  this.events = events || emptyMap
}

VirtualNode.prototype.type = 'VirtualNode'

VirtualNode.prototype.emit = function(type) {
  var fn = this.events[type]
  if (fn == null) return
  arguments[0] = this
  call.apply(fn, arguments)
}

module.exports = VirtualNode
