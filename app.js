import express from 'express';
import { createMovieRouter } from './routes/movie.js';
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config';

export const createApp = ({ movieModel }) => {
    const app = express()
    app.use(express.json())
    app.use(corsMiddleware())
    app.disable('x-powered-by')
  
    app.use('/movies', createMovieRouter({ movieModel }))
  
    const PORT = process.env.PORT ?? 1234
  
    app.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`)
    })
}