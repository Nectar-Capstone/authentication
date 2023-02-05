import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedInUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if(request.user){
    return request.user;
  }else{
    return null;
  }
});
