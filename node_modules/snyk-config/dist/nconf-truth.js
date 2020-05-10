"use strict";
/**
 * monkey patch nconf to support TRUE & FALSE on env & arg to port to bool
 */
Object.defineProperty(exports, "__esModule", { value: true });
const nconf = require("nconf");
const common = require("nconf/lib/nconf/common");
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore intentionally monkey-patching internals
// eslint-disable-next-line @typescript-eslint/no-explicit-any
nconf.Env.prototype.loadEnv = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.readOnly = false;
    Object.keys(process.env)
        .filter(function (key) {
        if (self.match && self.whitelist.length) {
            return key.match(self.match) || self.whitelist.indexOf(key) !== -1;
        }
        else if (self.match) {
            return key.match(self.match);
        }
        else {
            return !self.whitelist.length || self.whitelist.indexOf(key) !== -1;
        }
    })
        .forEach(function (key) {
        let value = process.env[key];
        if (value === 'TRUE' || value === 'true') {
            value = true;
        }
        else if (value === 'FALSE' || value === 'false') {
            value = false;
        }
        if (self.separator) {
            // spread would be better here; maybe next time...
            // eslint-disable-next-line prefer-spread
            self.set(common.key.apply(common, key.split(self.separator)), value);
        }
        else {
            self.set(key, value);
        }
    });
    this.readOnly = true;
    return this.store;
};
//# sourceMappingURL=nconf-truth.js.map