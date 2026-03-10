import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUserEmail = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const req = ctx.switchToHttp().getRequest();
        return req.email || req.user?.email;
    }
);
