import express from "express";
import ejs from "ejs";
import axios from "axios";
import bodyParser from "body-parser";

//
// README: This program is to get Joke of the day and it can translated between 4 languages;
// With the help of two APIs below; 
// -- JokeAPI          : https://sv443.net/jokeapi/v2
// -- Google Tranlation: https://rapidapi.com/googlecloud/api/google-translate1/
//  

const app = express();
const PORT = 3000;
const jokeURL = "https://v2.jokeapi.dev/joke/Misc";
const ggtransURL = "";
const ggtransApiKey = "AIzaSyAq3sX6R6nGoJQVylWB-ML6mFjWUsVZA6w";
var translatedQuestion;
var translatedAnswer;
var currentLang = "en";

app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true}));

app.get("/", async (req, res) => {    
    const result = await axios.get(jokeURL);
    res.render("index.ejs", {question: result.data.setup, answer: result.data.delivery} );
    res.status(200);
});

app.post("/en", async (req, res) => {
    if (currentLang != "en") {
        translateQandA(req, res, "en");
    }
});

app.post("/ch", async (req, res) => {
    if (currentLang != "zh-CN") {
        translateQandA(req, res, "zh-CN");
    }  
});

app.post("/es", async (req, res) => {
    if (currentLang != "es") {
        translateQandA(req, res, "es");
    }
});

app.post("/th", async (req, res) => {
    if (currentLang != "th") {
        translateQandA(req, res, "th");
    }
});

//
// Functions 
// 
async function translateQandA(req, res, targetLang) {
    translatedQuestion = await translateText(currentLang, targetLang, req.body.question);
    translatedAnswer = await translateText(currentLang, targetLang, req.body.answer);
    res.render("index.ejs", {question: translatedQuestion, answer: translatedAnswer} );
    res.status(200);
    currentLang = targetLang;
}
async function translateText(sourceLang, targetLang, textToTranslate) {
    const result = await axios.post('https://translation.googleapis.com/language/translate/v2', {},
     { params: {
        q: `${textToTranslate}`,
        source: `${sourceLang}`, 
        target: `${targetLang}`, 
        key: `${ggtransApiKey}`
     }
    });    
    var returnedResult = JSON.stringify(result.data.data.translations[0].translatedText);
    return returnedResult.slice(1,returnedResult.length-1).replace(/&quot;/g, '\"');
}

// Start listening to the port
app.listen(PORT, () => {
    console.log("App started at Port: " + PORT);
})