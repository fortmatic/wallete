"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TreeSizeLimitError extends Error {
    constructor() {
        super('Tree size exceeds the allowed limit.');
        this.code = 422;
        this.name = 'TreeSizeLimitError';
        Error.captureStackTrace(this, TreeSizeLimitError);
    }
}
exports.TreeSizeLimitError = TreeSizeLimitError;
//# sourceMappingURL=tree-size-limit-error.js.map