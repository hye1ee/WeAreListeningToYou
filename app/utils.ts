export interface DataChunk {
  date: string;
  location: string;
  data: { name: string, score: number, magnitude: number }[]
}