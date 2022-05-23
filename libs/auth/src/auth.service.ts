import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('AUTH_SERVICE') private client: ClientProxy
  ) {}

  async JWTVerify(id: string): Promise<any> {
    this.client.emit('user:verifyJWT', { token: '1234' })
    return { _id: '123' }
  }
}
