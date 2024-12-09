const pool = require('../pool');

const getCrosslinks = (request, response) => {

  const token = request.query.token;

  try {
    let sql = `
    SELECT lemma_id, link From cross_links
    `;

    pool.query(sql, (error, { rows: crossLinks }) => {
      if (!error) {

        response.status(200).json(crossLinks);

      } else {
        throw new Error(`Error fetching cross links list: ${error}`);
      }
    });
  } catch (error) {
    response.status(500).send(error);
  }
};

module.exports = {
  getCrosslinks
};