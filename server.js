const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// server middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Api routes
app.get("/api/notes",(req, res)=> {
    fs.readFile("./db/db.json", "utf-8", (err,data) => {
      if (err) throw err
      console.log(data)  
      const notes = JSON.parse(data)
      console.log(notes)
      res.json(notes)
    });
})

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', function(err, data) {
        let parsedNotes = JSON.parse(data)
        const { title, text } = req.body;
        const newNote = {
            title,
            text,

            id: uuidv4()
        };
       
        parsedNotes.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 3), function (err) {
            if (err) throw err;
            res.json(parsedNotes)
        })
    })
});
        

// html routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
