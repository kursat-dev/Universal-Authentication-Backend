"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const errors_js_1 = require("../utils/errors.js");
/**
 * Validation Middleware Factory
 * Validates request body, query, and params against a Zod schema
 */
function validate(schema) {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const details = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(new errors_js_1.ValidationError('Validation failed', details));
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map