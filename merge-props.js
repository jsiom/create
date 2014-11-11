/**
 * Merge properties and events onto a VirtualNode
 *
 * @param {VirtualNode} node
 * @param {Object} properties
 */

function mergeProperties(node, properties){
  var props = node.properties
  var events = node.events
  for (var key in properties) {
    var value = properties[key]
    if (typeof value == 'function' && /^on\w+$/.test(key)) {
      key = key.substring(2).toLowerCase()
      events[key] = events[key]
        ? function(previous, next){
            return function(event){
              previous.call(this, event)
              next.call(this, event)
            }
          }(events[key], value)
        : value
    } else if (key == 'class') {
      for (key in value) if (value[key]) {
        props.className = props.className
          ? props.className + ' ' + key
          : key
      }
    } else {
      props[key] = value
    }
  }
}

module.exports = mergeProperties
