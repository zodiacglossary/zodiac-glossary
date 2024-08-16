const pool = require('../pool');

const runAdvancedSearch = (request, response) => {
  try {
    const token = request.query.token;

    // // Put the query stuff in here
    // if (true) {
    //   response.status(200).json(['fake response from server-side rAS()']);
    // } else {
    //   response.status(500).send('fake error message');
    // }
    const sql = 'SELECT * FROM lemmata;';

    pool.query(sql, (error, results) => {
      if (error) throw error;
      response.status(200).json(results.rows);
    });


  } catch (error) {
    console.error('\n\nError in runAdvancedSearch()\n\n', error);
    response.status(500).send(error);
  }
};

module.exports = { runAdvancedSearch };