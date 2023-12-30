import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: 'alexmysql66$',
    database: 'moviesdb'
};

const connection = await mysql.createConnection(config);

export class MovieModel{
    static async getAll({genre}){
      if(genre){
        const lowerCaseGenre = genre.toLowerCase();

        const [genres] = await connection.query(
          'SELECT id, name FROM WHERE LOWER(name) = ?;', [lowerCaseGenre]
        );
      }
      const [result] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie;'
      )

      return result;
    }

    static async getById({ id }){
      const [result] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?);',
        [id]
      )

      return result;
    }

    static async create({ input }){
      const {
        genre: genreInput,
        title,
        year,
        duration,
        director,
        rate,
        poster
      } = input;

      const [uuidResult] = await connection.query('SELECT UUID() uuid;');
      const [{ uuid }] = uuidResult;

      try{
        await connection.query(
          `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
          [uuid, title, year, director, duration, poster, rate]
        );
      } catch(e){
        throw new Error('Error creating movie');
      }
     

      const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?)`,
        [uuid]
      );

      return movies[0];
    }

    static async delete({ id }){
      try{
        const [result] = await connection.query('DELETE FROM movie WHERE id = ?;', [id]);

        return result;
      } catch(e){
        console.log(e);
        throw new Error('Error deleting movie');
      }
    }

    static async update({ id, input }){
      const {
        genre: genreInput,
        title,
        year,
        duration,
        director,
        rate,
        poster
      } = input;

      try{
        const [result] = await connection.query(
          `UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?)`,
          [title, year, director, duration, poster, rate, id]
        );
        
        return result[0];
      } catch(e){
        console.log(e);
        throw new Error('Error updating movie');
      }
    }
}