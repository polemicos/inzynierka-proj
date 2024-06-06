const express = require('express');
const app = express();




app.get("/carplates/:id", (req, res)=>{
    res.send("Carplate number: " + req.params.id);
});

// app.get("/:author", (req, res)=>{
//     let author = req.params.author;
//     res.render("homepage.ejs", {
//         author: author 
//     });
// });
app.get("/carplates-list", (req, res) => {
    const cplist = [
        { number: '123ASD', firma: 'Volvo', photo: 'sdqwdeq' },
        { number: '45DFWE', firma: 'Volksvagen', photo: 'wergwegf' },
        { number: 'SDF123', firma: 'Opel', photo: 'sasdaregqe' },
        { number: '2SDF245', firma: 'Skoda', photo: 'asfdgerhj' }
    ];
    res.render("cplist.ejs", {
        list: cplist
    });
});

app.get("*", (req, res)=>{
    res.send("error!!! No such route!!!");
});


app.listen(3000, () =>{
    console.log("Listening on port 3000");
});