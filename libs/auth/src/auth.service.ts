import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'
import { first, lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(
    readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') readonly client: ClientProxy
  ) {}

  async JWTVerify(id: string): Promise<any> {
    try {
      return lastValueFrom(
        this.client.emit('user:verifyJWT', { id }).pipe(first())
      )
    } catch (e) {}
  }
}
