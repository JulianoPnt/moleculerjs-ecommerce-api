"use strict";


module.exports = {
    methods: {
        checkIsAuthenticated(ctx) {
            if (!ctx.meta.user)
                throw new Error("Unauthenticated");
        },
        checkUserRole(ctx) {
            if (ctx.action.role && ctx.meta.user.role != ctx.action.role && ctx.meta.user.role != 'admin')
                throw new Error("Forbidden");
        },
        checkOwner(ctx) {
            // Check the owner of entity
        }
    }
}