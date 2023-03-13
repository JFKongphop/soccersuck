const express = require('express');
const scarpeTableScore = require('./utils/scrapeTableScore');
const scarpeTablePlayerScore = require('./utils/scrapeTableTopScore')
const app = express();
app.use(express.json());


app.get('/', (req, res) =>{
    return res.json({test: 'api is running'});
});


app.get('/api/table-score/:league', async (req, res) => {
    const league = req.params.league;
    const checkLeague = Number(league);
    if (checkLeague > 0 && checkLeague < 8) {
        const table = await scarpeTableScore(league);

        const data = {
            message: 'ok',
            name: 'Table Score',
            table: table
        }

        return res.status(200).json(data);
    }

    return res.status(404).json({message: 'invalid league number'});
});


app.get('/api/table-player-score/:league', async (req, res) => {
    const league = req.params.league;
    const checkLeague = Number(league);
    if (checkLeague > 0 && checkLeague < 8) {
        const table = await scarpeTablePlayerScore(league);

        const data = {
            message: 'ok',
            name: 'Player Score',
            table: table
        }

        return res.status(200).json(data);
    }

    return res.status(404).json({message: 'invalid league number'});
});



app.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});