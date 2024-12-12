const premierLeagueTable = [
    {
        rank: 1,
        team: "Liverpool",
        gamesPlayed: 10,
        goalDifference: "19-6",
        diff: 13,
        points: 25,
        recentForm: ["W", "W", "W", "D", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 2,
        team: "Manchester City",
        gamesPlayed: 10,
        goalDifference: "21-11",
        diff: 10,
        points: 23,
        recentForm: ["D", "W", "W", "W", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 3,
        team: "Nottingham Forest",
        gamesPlayed: 10,
        goalDifference: "14-7",
        diff: 7,
        points: 19,
        recentForm: ["L", "D", "W", "W", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 4,
        team: "Chelsea",
        gamesPlayed: 10,
        goalDifference: "20-12",
        diff: 8,
        points: 18,
        recentForm: ["W", "D", "L", "W", "D"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 5,
        team: "Arsenal",
        gamesPlayed: 10,
        goalDifference: "17-11",
        diff: 6,
        points: 18,
        recentForm: ["W", "W", "L", "D", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 6,
        team: "Aston Villa",
        gamesPlayed: 10,
        goalDifference: "17-15",
        diff: 2,
        points: 18,
        recentForm: ["D", "D", "W", "D", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 7,
        team: "Tottenham Hotspur",
        gamesPlayed: 10,
        goalDifference: "22-11",
        diff: 11,
        points: 16,
        recentForm: ["W", "L", "W", "L", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 8,
        team: "Brighton & Hove Albion",
        gamesPlayed: 10,
        goalDifference: "17-14",
        diff: 3,
        points: 16,
        recentForm: ["L", "W", "W", "D", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 9,
        team: "Fulham",
        gamesPlayed: 10,
        goalDifference: "14-13",
        diff: 1,
        points: 15,
        recentForm: ["W", "L", "L", "D", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 10,
        team: "AFC Bournemouth",
        gamesPlayed: 10,
        goalDifference: "13-12",
        diff: 1,
        points: 15,
        recentForm: ["W", "L", "W", "D", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 11,
        team: "Newcastle United",
        gamesPlayed: 10,
        goalDifference: "10-10",
        diff: 0,
        points: 15,
        recentForm: ["D", "D", "L", "L", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 12,
        team: "Brentford",
        gamesPlayed: 10,
        goalDifference: "19-20",
        diff: -1,
        points: 13,
        recentForm: ["D", "W", "L", "W", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 13,
        team: "Manchester United",
        gamesPlayed: 10,
        goalDifference: "9-12",
        diff: -3,
        points: 12,
        recentForm: ["L", "D", "W", "L", "D"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 14,
        team: "West Ham United",
        gamesPlayed: 10,
        goalDifference: "13-19",
        diff: -6,
        points: 11,
        recentForm: ["D", "W", "L", "W", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 15,
        team: "Leicester City",
        gamesPlayed: 10,
        goalDifference: "14-18",
        diff: -4,
        points: 10,
        recentForm: ["L", "W", "W", "L", "D"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 16,
        team: "Everton",
        gamesPlayed: 10,
        goalDifference: "10-17",
        diff: -7,
        points: 9,
        recentForm: ["W", "D", "W", "D", "L"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 17,
        team: "Crystal Palace",
        gamesPlayed: 10,
        goalDifference: "8-13",
        diff: -5,
        points: 7,
        recentForm: ["L", "L", "L", "W", "D"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 18,
        team: "Ipswich Town",
        gamesPlayed: 10,
        goalDifference: "10-21",
        diff: -11,
        points: 5,
        recentForm: ["D", "L", "L", "L", "D"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 19,
        team: "Southampton",
        gamesPlayed: 10,
        goalDifference: "7-19",
        diff: -12,
        points: 4,
        recentForm: ["L", "L", "L", "L", "W"],
        nextOpponent: "Liverpool"
    },
    {
        rank: 20,
        team: "Wolverhampton Wanderers",
        gamesPlayed: 10,
        goalDifference: "14-27",
        diff: -13,
        points: 3,
        recentForm: ["L", "L", "L", "D", "D"],
        nextOpponent: "Liverpool"
    }
];

async function fetchStandingsAndMatches() {
    try {
        console.log('Fetching data...'); 
        
        const standingsResponse = await fetch('http://localhost:3000/api/standings');
        const standingsData = await standingsResponse.json();
        console.log('API Response:', standingsData);

        const matchesResponse = await fetch('http://localhost:3000/api/matches');
        const matchesData = await matchesResponse.json();

        const standingsBody = document.getElementById('standings-body');
        if (!standingsBody) return;

        standingsBody.innerHTML = '';

        if (standingsData?.standings?.[0]?.table) {
            const tableData = standingsData.standings[0].table;

            tableData.forEach(team => {
                const row = document.createElement('tr');
                
                if (team.position <= 4) {
                    row.classList.add('cl-position');
                } else if (team.position <= 6) {
                    row.classList.add('el-position');
                } else if (team.position >= 18) {
                    row.classList.add('rel-position');
                }

                // 최근 5경기 결과
                let formHTML = '';
                if (team.form) {
                    const recentForm = team.form.split(',').slice(0, 5);
                    formHTML = recentForm.map(result => `
                        <div class="result-indicator ${
                            result === 'W' ? 'win' : 
                            result === 'D' ? 'draw' : 
                            'loss'
                        }">${result}</div>
                    `).join('');
                }

                // 다음 경기 상대 찾기
                let nextOpponentLogo = '';
                if (matchesData?.matches) {
                    const nextMatch = matchesData.matches.find(match => {
                        const matchDate = new Date(match.utcDate);
                        return matchDate > new Date() && 
                               (match.homeTeam.id === team.team.id || 
                                match.awayTeam.id === team.team.id);
                    });

                    if (nextMatch) {
                        const nextOpponent = nextMatch.homeTeam.id === team.team.id ? 
                            nextMatch.awayTeam : nextMatch.homeTeam;
                        nextOpponentLogo = `<img src="${nextOpponent.crest}" alt="${nextOpponent.name}" class="team-logo">`;
                    }
                }

                row.innerHTML = `
                    <td>${team.position}</td>
                    <td>
                        <div class="team-cell">
                            <img src="${team.team.crest}" alt="${team.team.name}" class="team-logo">
                            <span class="team-name">${team.team.shortName || team.team.name}</span>
                        </div>
                    </td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.goalsFor}-${team.goalsAgainst}</td>
                    <td>${team.goalDifference}</td>
                    <td>${team.points}</td>
                    <td colspan="5" class="form-cell">${formHTML}</td>
                    <td class="next-opponent">${nextOpponentLogo}</td>
                `;
                
                standingsBody.appendChild(row);
            });
        } else {
            console.log('Falling back to default data');
            createStandingsTable();
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        createStandingsTable();
    }
}

function createStandingsTable() {
    const standingsBody = document.getElementById('standings-body');
    if (!standingsBody) return;
    
    standingsBody.innerHTML = '';
    
    premierLeagueTable.forEach(team => {
        const row = document.createElement('tr');
        
        if (team.rank <= 4) {
            row.classList.add('cl-position');
        } else if (team.rank <= 6) {
            row.classList.add('el-position');
        } else if (team.rank >= 18) {
            row.classList.add('rel-position');
        }

        const formHTML = team.recentForm.map(result => `
            <div class="result-indicator ${
                result === 'W' ? 'win' : 
                result === 'D' ? 'draw' : 
                'loss'
            }">${result}</div>
        `).join('');

        row.innerHTML = `
            <td>${team.rank}</td>
            <td>
                <div class="team-cell">
                    <img src="${teamLogos[team.team]}" alt="${team.team}" class="team-logo">
                    <span class="team-name">${team.team}</span>
                </div>
            </td>
            <td>${team.gamesPlayed}</td>
            <td>${team.won}</td>
            <td>${team.draw}</td>
            <td>${team.lost}</td>
            <td>${team.goalDifference}</td>
            <td>${team.diff}</td>
            <td>${team.points}</td>
            <td colspan="5" class="form-cell">${formHTML}</td>
            <td class="next-opponent">
                <img src="${teamLogos[team.nextOpponent]}" alt="${team.nextOpponent}" class="team-logo">
            </td>
        `;
        
        standingsBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchStandingsAndMatches);