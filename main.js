var http = require('http');
var fs = require('fs');
var url = require('url');//url모듈을 불러온ㄷ다.
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var Template = require('./lib/template.js');

var app = http.createServer(function(request,response){//http모듈안에있는 함수createServer
    var _url = request.url;
    var queryData = url.parse(_url, true).query;//query=url중에서 ? 뒷부
    var pathname = url.parse(_url, true).pathname; //pathname = path중에 querystring을 제외한 경로를 담는다.
    console.log(pathname);
    if(pathname === '/'){//home이 ㅑ ㅑㄹ()
      if(queryData.id === undefined){
        //fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
        fs.readdir('data',function(error, filelist){
          var title = 'Welcome';
          var description = "Hello, Node js~.~";
          var list = Template.LIST(filelist);
          var html = Template.HTML(title,list,`<h2>${title}</h2>
          <p>${description}</p>`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        })
        //});
      } else {
        fs.readdir('data',function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description,{//sanitizeHtml활용
              allowedTags:['h1']//특정태그는 sanitize안함
            });
            var list = Template.LIST(filelist);
            var html = Template.HTML(title,list,`<h2>${sanitizedTitle}</h2>
            <p>${sanitizedDescription}</p>`,
            `<a href="/create">create</a>
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="/delete_process" method="post" onsubmit="자바스크립트넣 ">
             <input type="hidden" name="id" value="${sanitizedTitle}">
             <input type="submit" value="delete">
             </form>
             `);//link는 다른 창으로 넘어갈때 사용
            response.writeHead(200);
            response.end(html);
          });
        });
      }
      //fs.readFile(__dirname + url)를 웹사이트에 띄운
    } else if(pathname ==='/create'){
      if(queryData.id === undefined){
        //fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
        fs.readdir('data',function(error, filelist){
          var title = 'WEB - create';
          var list = Template.LIST(filelist);
          var html = Template.HTML(title,list,`<form action = "/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description" ></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,'');
          response.writeHead(200);
          response.end(html);
        })
      }
    } else if(pathname==='/create_process'){
      var body ='';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title= post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description , 'utf8', function(err){
          response.writeHead(302,{Location:`/?id=${title}`});//200은 성공적인 파일전공, 404은 실패한 정보전송
          response.end();
        });
      });
    } else if(pathname==='/update'){
      fs.readdir('data',function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = Template.LIST(filelist);
          var html = Template.HTML(title,list,`
            <form action = "/create_process" method="post">
            <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname==='/update_process'){
      var body ='';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title= post.title;
        var description = post.description;
        var id = post.id;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`,description , 'utf8', function(err){
            response.writeHead(302,{Location:`/?id=${title}`});//200은 성공적인 파일전공, 404은 실패한 정보전송
            response.end();
        })
      });
    });
  } else if(pathname==='/delete_process'){
     var body ='';
     request.on('data',function(data){
       body += data;
     });
     request.on('end',function(){
       var post = qs.parse(body);
       var id = post.id;
       var filteredId = path.parse(id).base;
       fs.unlink(`data/${filteredId}`,function(error){
         response.writeHead(302,{Location:`/`});//200은 성공적인 파일전공, 404은 실패한 정보전송//redirection할때 header정보를 lcoation이라고
         response.end();
       })
   });
  }
    else {
      response.writeHead(404);//200은 성공적인 파일전공, 404은 실패한 정보전송
      response.end('Not found');
    }
});
app.listen(3000);//http를 서버에 구동시키는 API함,3000번 포트를 보고있다가 웹브라우저로붜 3000번 포트로 들어오면 App에 응답해서 동작
