"use strict";

const Ajv = require('ajv');
module.exports = function(RED) {
function JsonSchemaValidator(config) {
    RED.nodes.createNode(this, config);
    this.func = config.func;
    this.name = config.name;
    this.ajv = new Ajv({
        allErrors: config.allErrors,
        useDefaults: config.useDefaults,
        coerceTypes: config.coerceTypes,
        removeAdditional: config.removeAdditional,
        messages: config.messages
    });
    this.validate = this.ajv.compile(JSON.parse(this.func));

    var node = this;
    this.on('input', function(msg) {
        if (msg.payload !== undefined) {
            const valid = node.validate(msg.payload);
            if (!valid) {
                msg['error'] = node.validate.errors;
            }
            node.send(msg);
        }
    });
}

RED.nodes.registerType("json-schema", JsonSchemaValidator);
}