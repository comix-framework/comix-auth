import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'

export const CurrentUser = createParamDecorator<any>(
  async (data: unknown, context: ExecutionContext) => {
    const req: Request = GqlExecutionContext.create(context).getContext().req
    return req['user']
  }
)
