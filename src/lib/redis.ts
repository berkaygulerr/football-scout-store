import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://equipped-ray-31716.upstash.io',
  token: '********',
})