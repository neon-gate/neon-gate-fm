export interface MeResponseDto {
  id: string
  email: string
  name?: string | null
  provider: string
  createdAt: Date
}
