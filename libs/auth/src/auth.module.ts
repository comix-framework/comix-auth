import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '@app/auth/passport/jwt.strategy'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: async (config: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [await config.get<string>('USER_RMQ')],
              queue: 'users_queue',
              queueOptions: {
                durable: false
              }
            }
          }
        },
        inject: [ConfigService]
      }
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: await config.get<string>('USER_SECRET'),
        signOptions: { expiresIn: '3d' }
      })
    }),
    PassportModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
