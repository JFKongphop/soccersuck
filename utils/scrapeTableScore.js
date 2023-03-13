const cheerio = require('cheerio');
const axios = require('axios');

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
const scarpeTableScore = async (league) => {
    const url = 'https://www.soccersuck.com/';
    const containerTag = 'div#container';

    // trLeague1 the number of last index show of the league
    const tableTag = `div.content_main div.scoretable div.scoretable_show table.score_tb tr.trLeage${league}`;

    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        const item = $(containerTag);
        const table = $(item).find(tableTag).text();
        
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


        const tableScore = result.map((item) => {
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

        return tableScore;
    }
    catch {
        console.log('error');
    }
}

module.exports = scarpeTableScore;