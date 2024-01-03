export default function handler(req, res) {
    res.status(200).json({ message: 'Hello from Next.js!' })

    var data = image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile('image.webp', buf,function(err, result) {
      if(err){console.log('error', err);}
    });
}