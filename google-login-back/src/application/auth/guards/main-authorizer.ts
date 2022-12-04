import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleType } from 'src/common/role-type';
import { IS_PUBLIC } from '../decorator/meta-data/is-public';
import { IS_WEBHOOK } from '../decorator/meta-data/is-webhook';
import { ROLE } from '../decorator/meta-data/needs-permission';
import { Identity } from '../models/identity';
import { AuthorizerBase } from './abstract/authorizer-base';

@Injectable()
export class MainAuthorizer extends AuthorizerBase {
    constructor() {
        super();
    }

    private reflect<T>(context: GqlExecutionContext, reflector: Reflector, metaKey: string): T {
        return reflector.getAllAndOverride<T>(metaKey, [context.getHandler(), context.getClass()]);
    }

    // forbidden() {
    //     throw new ForbiddenException("You don't have access.");
    // }

    async canAccess(context: ExecutionContext, reflector: Reflector): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { identity } = this.getContextData(ctx);

        //IS PUBLIC .....................
        const isApiPublic = this.reflect<RoleType[]>(ctx, reflector, IS_PUBLIC);

        if (isApiPublic) {
            return true;
        }

        //IS WEBHOOk
        const isWebhook = this.reflect<boolean>(ctx, reflector, IS_WEBHOOK);
        if (isWebhook) {
            return identity.webhookAccess;
        }

        // all Apis need to login expect is public Apis ........
        if (!identity || identity.isAuthenticated === false) {
            throw new UnauthorizedException("You're not login!");
        }

        // NEEDS PERMISSION .................
        const config = this.reflect<RoleType[]>(ctx, reflector, ROLE);
        if (config) {
            const user = identity.user;

            if (!config.includes(user.role)) return false;
        }

        return true;
    }

    // noinspection JSMethodCanBeStatic
    private getContextData(ctx: GqlExecutionContext): { identity: Identity; request: any } {
        const { req } = ctx.getContext();
        return {
            identity: req['identity'] as Identity,
            request: req,
        };
    }
}
