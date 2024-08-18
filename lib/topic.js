var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
const { request } = require('http');

exports.home = function(request, response) {
  db.query(`SELECT * FROM topic`, function(error, topics){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.List(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
}

exports.page = function(request, response) {
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error) {
      throw error;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id
      WHERE topic.id=?`,[request.params.pageId], function(error2, topic){
      if(error2) {
        throw error2;
      }
      var title = topic[0].title;
      var description = topic[0].description;
      var list = template.List(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>
        ${description}
        <p>by ${topic[0].name}</p>`,
        `<a href="/create">create</a>
        <a href="/update/${request.params.pageId}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${request.params.pageId}">
          <input type="submit" value="delete">            
        </form>`
      );
      response.send(html);
    });
  });
}

exports.create = function(request, response) {
  db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
      var title = 'Create';
      var list = template.List(topics);
      var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
              <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
              <input type="submit">
          </p>
        </form>
        `, `<a href="/create">create</a>`);
        response.send(html);
    });
  });
}

exports.create_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
      body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`
      INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author],
      function(error, result) {
        if(error){
          throw error;
        }
        response.redirect(`/?id=${result.insertId}`);
      }    
    )
  });
}

exports.update = function(request,response) {
  db.query(`SELECT * FROM topic`, function(error, topics){
    if(error) {
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`, [request.params.pageId], function(error2, topic){
      if(error2) {
        throw error2;
      }
      db.query(`SELECT * FROM author`, function(error2, authors){
        var list = template.List(topics);
        var html = template.HTML(topic[0].title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
            <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.send(html);  
      });
    });
  });
}

exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, 
      [post.title, post.description, post.author, post.id], function(error, result){
      response.redirect(`/?id=${post.id}`);
    });
  });
}

exports.delete_process = function(request, response) {
  var body = '';
  request.on('data', function(data){
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id = ?`, [post.id], function(error, result){
      if(error){
        throw error;
      }
      response.redirect(`/`);
    });
  });
}