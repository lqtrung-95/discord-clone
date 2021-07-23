import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class MemberGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
