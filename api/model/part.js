'use strict';

function Part(id,type, def, attachments) {
	this.id = id
	this.type = type;
	this.def = def;
	this.attachments = attachments || [];
}

module.exports = Part;