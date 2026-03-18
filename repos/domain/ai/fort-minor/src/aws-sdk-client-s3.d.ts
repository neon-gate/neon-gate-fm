declare module '@aws-sdk/client-s3' {
  import type { Readable } from 'node:stream'

  export interface S3ClientConfig {
    region?: string
    endpoint?: string
    forcePathStyle?: boolean
    credentials?: {
      accessKeyId: string
      secretAccessKey: string
    }
  }

  export class GetObjectCommand {
    constructor(input: { Bucket: string; Key: string })
  }

  export class S3Client {
    constructor(config?: S3ClientConfig)
    send(command: GetObjectCommand): Promise<{ Body?: Readable }>
  }
}
