const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const jimp=require('jimp');
const formidable=require('formidable');
const path=require('path');
const fs=require('fs');

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