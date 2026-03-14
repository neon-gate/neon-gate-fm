export abstract class TranscoderPort {
  abstract transcode(inputFile: string, bitrate: number): Promise<string>
}
