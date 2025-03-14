import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://opentdb.com/api.php?amount=10";

var start = true;
var content;
var score = 0;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL);
        content = result.data;
        score = 0;
        res.render("index.ejs", { start: start, score: score, content: result.data });

    } catch (error) {
        res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
});

app.post("/results", (req, res) => {
    start = false;

    for (let i = 0; i < content.results.length; i++)
    {
        console.log(req.body["question"+i] + " - - - " + content.results[i].correct_answer);
        if(req.body["question"+i] == content.results[i].correct_answer)
        {
            score++;
        }
    }
    console.log(score);
    res.render("index.ejs", { start: start, score: score });
});

app.post("/playagain", (req, res)=>{
    start = true;
    res.redirect("/");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
