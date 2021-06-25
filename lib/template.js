var Template={
  HTML:function(title,_list,body,control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}.id</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${_list}
      ${control}
      ${body}
    </body>
    </html>`;},
    LIST:function(filelist){
    var list = `<ul>`;
    var i=0;
    while(i<filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
      i=i+1;
    }
    list = list+`</ul>`;
    return list;
  }
}

module.exports = Template;
