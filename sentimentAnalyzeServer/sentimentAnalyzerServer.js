const express = require('express');
const app = new express();
const dotenv = require('dotenv');

dotenv.config();

function getNLUInstance() {

    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}



function getParam(text, url, sentiment, emotion) {
    let analyzeParams = {
        'features': {
            'keywords': {
                'emotion': emotion,
                'sentiment': sentiment,
                'limit': 2,
            },
        },
    };
    if (text) {
        analyzeParams.text = text;
    }
    if (url) {
        analyzeParams.url = url;
    }
    return analyzeParams;
}


app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

function setJsonResultEmotion(analysisResults, sentiment, emotion) {
    let temp = { result: [] };
    let resp = analysisResults.result.keywords;
    for (i in resp) {
        let resultado = [];

        if (emotion) {
            let emotionJson = resp[i].emotion;
            for (var j in emotionJson) {
                resultado.push([j, emotionJson[j]]);
            }
        }
        if (sentiment) {
            let sentimentJson = resp[i].sentiment;
            for (var j in sentimentJson) {
                resultado.push([j, sentimentJson[j]]);
            }

        }
        temp.result.push({
            text: resp[i].text,
            emotion: resp[i].emotion,
            emotions: resultado,
            sentiment: resp[i].sentiment,
            sentiments: resultado
        });
    }

    return temp;
}

app.get("/url/emotion", async (req, res) => {
    let json = { error: '', result: [] };
    if (!req.query.url) {
        json.error = 'Please fill in the url.';
        return res.send(json);
    }
    let params = getParam('', req.query.url, false, true);
    let naturalLanguageUnderstanding = getNLUInstance()
    let analysisResults = await naturalLanguageUnderstanding.analyze(params);
    if (analysisResults) {
        json.result = setJsonResultEmotion(analysisResults, false, true).result;
    } else {
        json.error = 'Erro';
    }
    return res.send(json);
});

app.get("/url/sentiment", async (req, res) => {
    let json = { error: '', result: [] };
    if (!req.query.url) {
        json.error = 'Please fill in the url.';
        return res.send(json);
    }
    let naturalLanguageUnderstanding = getNLUInstance()
    let params = getParam('', req.query.url, true, false);

    let analysisResults = await naturalLanguageUnderstanding.analyze(params);
    if (analysisResults) {
        json.result = setJsonResultEmotion(analysisResults, true, false).result;
    } else {
        json.error = 'Erro';
    }
    return res.send(json);
});

app.get("/text/emotion", async (req, res) => {
    let json = { error: '', result: [] };
    if (!req.query.text) {
        json.error = 'Please fill in the text.';
        return res.send(json);
    }
    let naturalLanguageUnderstanding = getNLUInstance()
    let params = getParam(req.query.text, '', false, true);
    let analysisResults = await naturalLanguageUnderstanding.analyze(params);

    if (analysisResults) {
        json.result = setJsonResultEmotion(analysisResults, false, true).result;
    } else {
        json.error = 'Erro';
    }
    return res.send(json);
});



app.get("/text/sentiment", async (req, res) => {
    let json = { error: '', result: [] };
    if (!req.query.text) {
        json.error = 'Please fill in the text.';
        return res.send(json);
    }
    let naturalLanguageUnderstanding = getNLUInstance()
    let params = getParam(req.query.text, '', true, false);

    let analysisResults = await naturalLanguageUnderstanding.analyze(params);
    if (analysisResults) {
        json.result = setJsonResultEmotion(analysisResults, true, false).result;
    } else {
        json.error = 'Erro';
    }
    return res.send(json);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

