import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WsMemberGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
