import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@app/auth/passport/jwt.strategy'

export const AUTH_SERVICE = ClientsModule.registerAsync([
  {
    name: 'AUTH_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return {
        transport: Transport.RMQ,
        options: {
          urls: [config.get<string>('USER_RMQ')],
          queue: 'users_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    }
  }
])

export const JWT_MODULE = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('USER_SECRET'),
    signOptions: { expiresIn: '3d' }
  })
})

@Module({
  imports: [AUTH_SERVICE, JWT_MODULE, ConfigModule, PassportModule],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
