const path = require('path');
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const settings = require('./settings');
const lemmata = require('./lemmata');
const users = require('./users');
const ac = require('./autocomplete');
const td = require('./todo');
const recents = require('./queries/recents');
const advancedSearch = require('./queries/advancedSearch');

const auth = require('./middleware/auth');
const { getCrosslinks } = require('./queries/crossLinks');

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());

app.get('/api', (request, response) => {
  let greeting = `<h1>The Zodiac Glossary API</h1>
    <p>This API is for working directly with the Zodiac Glossary data.</p>
    <p>All data related to this project are freely publicly accessible. You are welcome to use this API as you wish, but documentation is currently not available.</p>
    <p>Please <a href="https://zodiac.fly.dev">return to the homepage</a> to continue using the Zodiac Glossary.</p>
    <p>For help or inquiries, write to <a href="mailto:christian.casey@fu-berlin.de">christian.casey@fu-berlin.de</a>.</p>
    <p>Version 1.50</p>`;
  response.send(greeting);
});

// Standard immutable values
app.get('/api/languages', settings.getLanguages);
app.get('/api/partsofspeech', settings.getPartsOfSpeech);

// Lemmata list
app.get('/api/lemmata/list', lemmata.getLemmataList);
app.get('/api/lemmata/add', auth, lemmata.addNewLemma);

// Lemma
app.get('/api/lemma/get', lemmata.getLemma);
app.patch('/api/lemma/save', auth, lemmata.saveLemma);
app.delete('/api/lemma/delete', auth, lemmata.deleteLemma);
app.get('/api/lemma/history', auth, lemmata.getEditHistory);

app.patch('/api/lemma/check', auth, lemmata.checkLemma);

// Quotation => Meanings
app.get('/api/meanings', lemmata.getMeanings); // Unused endpoint, probably not needed

// Autocomplete
app.get('/api/autocomplete/meanings', ac.meaningCategories);
app.get('/api/autocomplete/quotations', ac.quotationSource);
app.get('/api/autocomplete/quotation_from_source', ac.quotationAutofillFromSource);

// Todo List
app.get('/api/todo/list', auth, td.getTodoList);
app.post('/api/todo/add', auth, td.addTodoListItem);

// Recents List
app.get('/api/recents/list', auth, recents.getLemmataList);

// Crosslinks
app.get('/api/crosslinks/list', getCrosslinks);

// User authentication
app.post('/api/users', users.createUser);
app.post('/api/users/login', users.loginUser);
app.get('/api/users/profile', auth, users.getUser);

app.get('/api/contributors', auth, users.getContributions);

// Advanced Search
app.post('/api/advanced_search', auth, advancedSearch.runAdvancedSearch);


app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});









app.listen(port, "0.0.0.0", () => console.log(`Zodiac Glossary app listening on port ${port}.`));