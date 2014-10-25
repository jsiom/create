function VirtualText(text) {
  this.text = String(text)
}

VirtualText.prototype.type = 'VirtualText'

module.exports = VirtualText
