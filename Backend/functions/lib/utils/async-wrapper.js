"use strict";
module.exports.AsyncWrapper = function AsyncWrapper(fn) {
    return (req, res, next) => {
        return fn(req, res).catch(next);
    };
};
//# sourceMappingURL=async-wrapper.js.map