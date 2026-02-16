
export interface Location {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export interface AppState {
  loading: boolean;
  error: string | null;
  results: SearchResult | null;
}
