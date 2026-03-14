import { NestFactory } from '@nestjs/core'

import { requireNumberEnv } from '@infra/env'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = requireNumberEnv('PORT')

  await app.listen(port)
  console.log(`[Backstage] Listening on port ${port}`)
}

bootstrap()
