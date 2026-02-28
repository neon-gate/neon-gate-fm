import { NestFactory } from '@nestjs/core'
import { Transport, type MicroserviceOptions } from '@nestjs/microservices'

import { EnvFlag, EnvService } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    const env = app.get(EnvService)
    const port = env.requireNumber(EnvFlag.Port)
    const rabbitMqUrl = env.requireString(EnvFlag.RabbitMqUrl)
    const rabbitMqPlayerQueue = env.requireString(EnvFlag.RabbitMqPlayerQueue)

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: rabbitMqPlayerQueue,
        queueOptions: { durable: true }
      }
    })

    await app.startAllMicroservices()
    await app.listen(port)
  } catch (error) {
    console.error('Player service startup failed:', error)
    process.exit(1)
  }
}

void bootstrap()
