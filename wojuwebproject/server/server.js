const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

// API 설정
const API_KEY = '81cb058adf784977a99e544f38704ea2';
const BASE_URL = 'https://api.football-data.org/v4';
const NAVER_CLIENT_ID = 'EYMdS9dkLVmLPzjH4KAG';
const NAVER_CLIENT_SECRET = '1MA1GuRoDO';

// CORS 설정
app.use(cors());

// Content Security Policy 설정
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
        "script-src * 'unsafe-inline' 'unsafe-eval'; " +
        "connect-src * 'unsafe-inline'; " +
        "img-src * data: blob: 'unsafe-inline'; " +
        "frame-src *; " +
        "style-src * 'unsafe-inline';"
    );
    next();
});

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Football-data.org API 라우트
app.get('/api/standings', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/competitions/PL/standings`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/matches', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/competitions/PL/matches`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/teams', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/competitions/PL/teams`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 이적 정보 라우트 (샘플 데이터)
app.get('/api/transfers', async (req, res) => {
    const sampleTransfers = {
        transfers: [
            {
                name: "도미닉 솔랑케",
                position: "공격수",
                fromTeam: {
                    name: "본머스",
                    crest: "/images/teams/alianza.png"
                },
                toTeam: {
                    name: "토트넘 훗스퍼",
                    crest: "/images/teams/cienciano.png"
                },
                fee: "963억원",
                contractUntil: "6년",
                date: "2024년 8월"
            },
            {
                name: "양민혁",
                position: "공격수",
                fromTeam: {
                    name: "강원FC",
                    crest: "/images/teams/default.png"
                },
                toTeam: {
                    name: "토트넘 훗스퍼",
                    crest: "/images/teams/default.png"
                },
                fee: "59억원",
                contractUntil: "5년",
                date: "2024년 7월"
            }
        ]
    };
    res.json(sampleTransfers);
});


// 메인 페이지용 뉴스 API (4개만 표시)
app.get('/api/news/preview', async (req, res) => {
    try {
        //console.log('Fetching preview news...');//
        const query = encodeURIComponent('프리미어리그');
        const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=4&sort=date`;
        
        const response = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('News API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch news',
            details: error.message 
        });
    }
});
// 네이버 뉴스 API 라우트
// 뉴스 페이지용 전체 뉴스 API (100개 표시)
app.get('/api/news', async (req, res) => {
    try {
        const query = encodeURIComponent('프리미어리그');
        const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=100&sort=date`;
        
        const response = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch news',
            details: error.message 
        });
    }
});

// 이적 관련 뉴스 API 라우트
app.get('/api/transfer-news', async (req, res) => {
    try {
        const query = encodeURIComponent('프리미어리그 이적');
        const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=20&sort=date`;
        
        const response = await fetch(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch news',
            details: error.message 
        });
    }
});

// HTML 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/teams', (req, res) => {
    res.sendFile(path.join(__dirname, '../teams.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '../news.html'));
});

app.get('/transfers', (req, res) => {
    res.sendFile(path.join(__dirname, '../transfers.html'));
});

app.get('/write', (req, res) => {
    res.sendFile(path.join(__dirname, '../write.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../edit.html'));
});

app.get('/noticeboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../noticeboard.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, '../post.html'));
});

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행중입니다`);
    console.log(`http://localhost:${port} 으로 접속하세요`);
});


// 특정 팀의 상세 정보를 가져오는 엔드포인트
app.get('/api/team/:id', async (req, res) => {
    try {
        const teamResponse = await fetch(`${BASE_URL}/teams/${req.params.id}`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        
        if (!teamResponse.ok) {
            throw new Error(`Team API Error: ${teamResponse.status}`);
        }
        
        const teamData = await teamResponse.json();
        
        // 기본 squad 정보 사용 (추가 API 호출 없이)
        // 필요한 정보만 정제해서 반환
        teamData.squad = teamData.squad.map(player => ({
            id: player.id,
            name: player.name,
            position: player.position,
            dateOfBirth: player.dateOfBirth,
            nationality: player.nationality,
            shirtNumber: player.shirtNumber
        }));

        res.json(teamData);
    } catch (error) {
        console.error('Team API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch team data',
            details: error.message 
        });
    }
});

// 특정 팀의 경기 일정을 가져오는 엔드포인트
app.get('/api/team/:id/matches', async (req, res) => {
    try {
        const teamId = req.params.id;
        const response = await fetch(`${BASE_URL}/teams/${teamId}/matches?status=SCHEDULED`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 선수 상세 정보는 별도 엔드포인트로 분리
app.get('/api/player/:id', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/persons/${req.params.id}`, {
            headers: { 'X-Auth-Token': API_KEY }
        });
        
        if (!response.ok) {
            throw new Error(`Player API Error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Player API Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch player data',
            details: error.message 
        });
    }
});