const testFolder = './data';//node.js기준
const fs = require('fs');

fs.readdir(testFolder,function(error, filelist){
  console.log(filelist);//filelist=파일목록을 배열로 표d
});
