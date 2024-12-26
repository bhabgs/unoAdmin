"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yml = require("yaml");
const fs = require("fs");
const file = fs.readFileSync('../config.yml', 'utf8');
const config = yml.parse(file);
exports.default = config;
//# sourceMappingURL=config.js.map