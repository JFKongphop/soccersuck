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
const scarpeTablePlayerScore = async (league) => {
    const url = 'https://www.soccersuck.com/';
    const containerTag = 'div#container';

    // trLeague1 the number of last index show of the league
    const tableTag = `div.content_main div.scoretable div.scoretable_show table.score_tbtop tr.trLeage${league}`;

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

            if ((i + 1) % 5 === 0) {
                result.push(temp.trim());
                temp = '';
            }
        }


        const playerScore = result.map(player => {
            const [number, ...nameAndTeam] = player.split(' ');

            return {
                Number: number, 
                Name: nameAndTeam.slice(0, -2).join(' '), 
                Team: nameAndTeam.slice(-2, -1)[0], 
                Score: nameAndTeam.slice(-1)[0] 
            };
        });

        return playerScore;
    }
    catch {
        console.log('error');
    }
}


module.exports = scarpeTablePlayerScore;;