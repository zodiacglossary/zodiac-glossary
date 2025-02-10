const getLemmataList = (pool, token) => {
  try {
    return new Promise((resolve, reject) => {
      let sql = `
      SELECT lemma_id, editor, published, original, translation, primary_meaning, transliteration, literal_translation2, checked, attention, last_edit, languages.value AS language, m.value, mc.category
      FROM lemmata as l
      LEFT JOIN languages USING (language_id)
      LEFT JOIN partsofspeech USING (partofspeech_id)
      LEFT JOIN meanings as m USING (lemma_id)
      LEFT JOIN meaning_categories AS mc ON m.meaning_id = mc.meaning_id
      `;

      // If no user logged in, show only published lemmata
      if (!token || token === "null") {
        sql = sql + " WHERE published = TRUE";
      }

      pool.query(sql, (error, data) => {
        if (!error) {
          // group lemma x meaning results by lemma_id
          const groupedLemmata = data.rows.reduce(
            (accumulator, lemmaMeaning) => {
              (accumulator[lemmaMeaning.lemma_id] =
                accumulator[lemmaMeaning.lemma_id] || []).push(lemmaMeaning);
              return accumulator;
            },
            {},
          );

          // move meaning x category results to `meanings` field
          const lemmataMapping = Object.entries(groupedLemmata).map(
            ([_lemmaId, lemmaMeanings]) => {
              const pivot = lemmaMeanings[0];
              const result = {
                lemmaId: pivot.lemma_id,
                ...pivot,
                meanings: lemmaMeanings.map((lemmaMeaning) => ({
                  value: lemmaMeaning.value,
                  category: lemmaMeaning.category,
                })),
              };
              delete result.lemma_id;
              return result;
            },
          );

          resolve(lemmataMapping);
        } else {
          reject(`Error fetching lemmata list: ${error}`);
        }
      });
    });
  } catch (error) {
    console.error("\n\nError in getLemmataList()\n\n", error);
  }
};

module.exports = getLemmataList;

