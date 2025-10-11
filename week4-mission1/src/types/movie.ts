export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title?: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    name?: string;
};

export type MovieResponse = {
    page: number;
    results: Movie[];
    totalPages: number;
    total_results: number;
}

export type MovieDetail = {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    vote_average: number;
    runtime: number;
}



export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export type Crew ={
  id: number;
  name: string;
  job: string;
}