const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'component-demos');

console.log('尝试读取目录：', targetDir);

fs.readdir(targetDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('读取文件夹出错:', err.message);
    return;
  }

  if (!files || files.length === 0) {
    console.log('目录为空或没有找到任何内容。');
    return;
  }

  const folders = files
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (folders.length === 0) {
    console.log('没有找到任何子文件夹。');
  } else {
    console.log('一级子文件夹名称如下:');
    console.log(folders.join(','))
  }
});
