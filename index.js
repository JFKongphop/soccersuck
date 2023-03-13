const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

/**
 * 
 * @param {*} league 
    1 : Premier
    2 : La Liga
    3 : Seria A
    4 : Bundesliga
    5 : Thai League
    6 : France
    7 : J League
 * @returns table score of this league
 */
const scarpeTable = async (league) => {
    const url = 'https://www.soccersuck.com/';
    const containerTag = 'div#container';

    // trLeague1 the number of last index show of the league
    const tableTag = `div.content_main div.scoretable div.scoretable_show table.score_tb tr.trLeage${league}`;

    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        const item = $(containerTag);
        const table = $(item).find(tableTag).text();

        // return table;
        const lines = table.split('\n').map(line => line.trim());
        const result = [];
        let temp = '';
        for (let i = 0; i < lines.length; i++) {
            temp += lines[i] + ' ';

            if ((i + 1) % 11 === 0) {
                result.push(temp.trim());
                temp = '';
            }
        }


        const newTable = result.map((item) => {
            const arr = item.split(' '); // split the string into an array
            return {
                Number: arr[0],
                Team: arr.slice(1, -8).join(' '), // join the team name with spaces [start with name and end with the first element of match]
                Match: arr[arr.length - 8],
                Win: arr[arr.length - 7],
                Draw: arr[arr.length - 6],
                Lost: arr[arr.length - 5],
                Scored: arr[arr.length - 4],
                Conceded: arr[arr.length - 3],
                Difference: arr[arr.length - 2],
                Point: arr[arr.length - 1]
            };
        });

        return newTable;
    }
    catch {
        console.log('error');
    }
}


app.get('/', (req, res) =>{
    return res.json({test: 'api in running'});
});


app.get('/api/table/:league', async (req, res) => {
    const league = req.params.league;
    const checkLeague = Number(league);
    if (checkLeague > 0 && checkLeague < 8) {
        const table = await scarpeTable(league);

        const data = {
            message: 'ok',
            table: table
        }

        return res.status(200).json(data);
    }

    return res.status(404).json({message: 'invalid league number'});
});


app.listen(8080, () => {
    console.log('server running at http://localhost:8080');
});