const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const jimp=require('jimp');
const formidable=require('formidable');
const path=require('path');
const fs=require('fs');
const sqlite3=require('sqlite3').verbose();
const db=new sqlite3.Database('./db.db');

const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

 /*  db.serialize(async () => {
    await query("CREATE TABLE IF NOT EXISTS posts (date text, title text, author text, content text, tags text)", 'run');
  }); */
 // query(`INSERT INTO posts VALUES ("${new Date().toISOString()}", "dddd", "Ryan Glover", "ds46f54sd65f46sd54f654", "1")`, 'run').then(() => {console.log("subido")});
  query("SELECT * FROM posts").then(result=>{
    console.log(result);
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(3000,()=>{
    console.log('Server started at port 3000');
})

app.post('/upload',async(req,res)=>{
    const form = formidable({multiples:true});
    form.parse(req,async(err,fields,files)=>{
        if(err) throw err;
        console.log(fields);
         console.log(files);
        await imgadd(files);
        })
    res.send("Uploaded");
})
const imgadd=async(files)=>{
const fileType=files.file.mimetype.split('/')[1];
const dirFile=path.join(__dirname,`img/${new Date().getTime()}.${fileType}`);
console.log(dirFile);

jimp.read(files.file.filepath, (err, res) => {
    if (err) throw new Error(err);
    res.quality(90).resize(500,jimp.AUTO).write(dirFile);
  });

}
app.get("/img/:nombre",(req,res)=>{
    res.sendFile(path.join(__dirname,'img/'+req.params.nombre));
    //1657661951573.jpeg
})