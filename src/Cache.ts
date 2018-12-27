export class Cache {
    private static instance: Cache
    static getInstance() {
        if (!this.instance) this.instance = new Cache()
        return this.instance
    }
    private constructor() { }

    movies: Object[] = []
    genres: String[] = []
    countries: String[] = []
    messages=[]
    user = { username: null, password: null }
    _operative = {}

    signOut() {
        this.user = { username: null, password: null }
    }

    getMovieById(id: string) {
        for (let i = 0; i < this.movies.length; i++) {
            if (id === this.movies[i]['_id']) {
                return this.movies[i]
            }
        }
        return undefined
    }

    pushMovie(movie: { _id }) {
        if (!this.getMovieById(movie._id)) {
            this.movies.push(movie)
        }
    }
}