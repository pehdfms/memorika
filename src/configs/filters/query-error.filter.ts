import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { QueryFailedError } from 'typeorm'

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const detail = exception.detail

    if (typeof detail === 'string' && detail.includes('already exists')) {
      const message = exception.table.split('_').join(' ') + ' with'
      exception = new ConflictException(
        (exception.detail as string).replace('Key', message).replace('=', ' = ')
      )
    }

    return super.catch(exception, host)
  }
}
