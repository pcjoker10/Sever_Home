var express = require('express');
var app = express();
var port = 3000;

var topic = require('./lib/topic');
var author = require('./lib/author');

app.get('/', (request, response) => {
  topic.home(request, response);
});

app.get('/page/:pageId', (request, response) => {
  topic.page(request, response);
});

app.get('/create', (request, response) => {
  topic.create(request, response);
});

app.post('/create_process', (request, response) => {
  topic.create_process(request, response);
});

app.get('/update/:pageId', (request, response) => {
  topic.update(request, response);
});

app.post('/update_process', (request, response) => {
  topic.update_process(request, response);
});

app.post('/delete_process', (request, response) => {
  topic.delete_process(request, response);
});

app.get('/author', (request, response) => {
  author.home(request, response);
});

app.post('/author/create_process', (request, response) => {
  author.create_process(request, response);
});

app.get('/author/update', (request, response) => {
  author.update(request, response);
});

app.post('/author/update_process', (request, response) => {
  author.update_process(request, response);
});

app.post('/author/delete_process', (request, response) => {
  author.delete_process(request, response);
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`)
});