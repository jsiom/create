var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, events) {
	this.tagName = tagName
	this.properties = properties || noProperties
  this.children = children || noChildren
  this.events = events || noProperties
}

VirtualNode.prototype.type = 'VirtualNode'

module.exports = VirtualNode
