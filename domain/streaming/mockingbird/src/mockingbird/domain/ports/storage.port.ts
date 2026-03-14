export abstract class StoragePort {
  abstract download(objectKey: string): Promise<string>
  abstract upload(objectKey: string, filePath: string): Promise<void>
}
