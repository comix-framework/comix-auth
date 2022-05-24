import { Inject, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') readonly client: ClientProxy
  ) {}

  async JWTVerify(id: string): Promise<any> {
    try {
      const user = await lastValueFrom(
        this.client.send('user:verifyJWT', { id })
      )
      this.logger.debug('Auth with user: ' + user.id)
      return user
    } catch (e) {
      this.logger.debug('Auth failed: ' + e.message)
    }
  }
}
