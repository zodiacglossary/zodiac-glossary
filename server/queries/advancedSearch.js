const pool = require('../pool');

const makeWhereClause = whereComponents => {
  let values = [];
  let counter = 0;

  let clauses = whereComponents.map(component => {
    let conditions = component.conditions.map(condition => {
      
      ++counter;

      if (component.type === 'string') {
        values.push('%' + condition + '%');
        return 'UPPER(' + component.fieldName + ") LIKE UPPER($" + counter + ')'; 
      } else {
        values.push(condition);
        return component.fieldName + " = $" + counter; 
      }
    });
    return '(' + conditions.join(' OR ') + ')';
  });

  let whereClause = clauses.join(' AND ');
  return { 
    whereClause,
    values
  };
};

const runAdvancedSearch = (request, response) => {
  let whereComponents = request.body;
  let {whereClause, values} = makeWhereClause(whereComponents);
  
  if (!values.length) {
    response.status(200).json([]);
    return;
  }

  // If no user is logged in, show only published lemmata
  const token = request.decoded;
  whereClause += (token ? '' : " AND published = TRUE");

  try {
    const sql = `SELECT l.lemma_id, l.editor, l.published, l.language_id, l.partofspeech_id, l.translation, l.loan_language_id, 
      l.transliteration AS disp_transliteration, l.original AS disp_original, l.primary_meaning as disp_meaning
        FROM lemmata as l
        LEFT JOIN (SELECT m.lemma_id, m.value, mc.category FROM meanings AS m LEFT JOIN meaning_categories as mc USING (meaning_id)) as m USING (lemma_id)
        LEFT JOIN variants as v USING (lemma_id)
        LEFT JOIN quotations as q USING (lemma_id)
        WHERE ` + whereClause + `
        GROUP BY lemma_id;`;
    console.log(sql);
    console.log(values)

    pool.query(sql, values, (error, results) => {
      if (error) throw error;
      response.status(200).json(results.rows);
    });
  } catch (error) {
    console.error('\n\nError in runAdvancedSearch()\n\n', error);
    response.status(500).send(error);
  }
};

module.exports = { runAdvancedSearch };