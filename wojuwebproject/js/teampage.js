// 팀 로고 URL
const teamLogos = {     
    "Liverpool": "https://resources.premierleague.com/premierleague/badges/70/t14.png",     
    "Manchester City": "https://resources.premierleague.com/premierleague/badges/70/t43.png",     
    "Nottingham Forest": "https://resources.premierleague.com/premierleague/badges/70/t17.png",     
    "Chelsea": "https://resources.premierleague.com/premierleague/badges/70/t8.png",     
    "Arsenal": "https://resources.premierleague.com/premierleague/badges/70/t3.png",     
    "Aston Villa": "https://resources.premierleague.com/premierleague/badges/70/t7.png",     
    "Tottenham Hotspur": "https://resources.premierleague.com/premierleague/badges/70/t6.png",     
    "Brighton & Hove Albion": "https://resources.premierleague.com/premierleague/badges/70/t36.png",     
    "Fulham": "https://resources.premierleague.com/premierleague/badges/70/t54.png",     
    "AFC Bournemouth": "https://resources.premierleague.com/premierleague/badges/70/t91.png",     
    "Newcastle United": "https://resources.premierleague.com/premierleague/badges/70/t4.png",     
    "Brentford": "https://resources.premierleague.com/premierleague/badges/70/t94.png",     
    "Manchester United": "https://resources.premierleague.com/premierleague/badges/70/t1.png",     
    "West Ham United": "https://resources.premierleague.com/premierleague/badges/70/t21.png",     
    "Leicester City": "https://resources.premierleague.com/premierleague/badges/70/t13.png",     
    "Everton": "https://resources.premierleague.com/premierleague/badges/70/t11.png",     
    "Crystal Palace": "https://resources.premierleague.com/premierleague/badges/70/t31.png",     
    "Ipswich Town": "https://resources.premierleague.com/premierleague/badges/70/t40.png",     
    "Southampton": "https://resources.premierleague.com/premierleague/badges/70/t20.png",     
    "Wolverhampton Wanderers": "https://resources.premierleague.com/premierleague/badges/70/t39.png" 
};

// 팀 한글 이름
const teamNamesKorean = {
    "Liverpool": "리버풀",     
    "Manchester City": "맨체스터 시티",
    "Nottingham Forest": "노팅엄 포레스트",
    "Chelsea": "첼시",
    "Arsenal": "아스널",
    "Aston Villa": "아스톤 빌라",
    "Tottenham Hotspur": "토트넘 홋스퍼",
    "Brighton & Hove Albion": "브라이튼",
    "Fulham": "풀럼",
    "AFC Bournemouth": "본머스",
    "Newcastle United": "뉴캐슬 유나이티드",
    "Brentford": "브렌트포드",
    "Manchester United": "맨체스터\n유나이티드",
    "West Ham United": "웨스트햄\n유나이티드",
    "Leicester City": "레스터 시티",
    "Everton": "에버턴",
    "Crystal Palace": "크리스탈 팰리스",
    "Ipswich Town": "입스위치 타운",
    "Southampton": "사우샘프턴",
    "Wolverhampton Wanderers": "울버햄튼"
};

// Football-data.org API 팀 ID
const teamIds = {
    "Arsenal": 57,
    "Aston Villa": 58,
    "Brighton & Hove Albion": 397,
    "Chelsea": 61,
    "Crystal Palace": 354,
    "Everton": 62,
    "Fulham": 63,
    "Liverpool": 64,
    "Manchester City": 65,
    "Manchester United": 66,
    "Newcastle United": 67,
    "Nottingham Forest": 351,
    "Leicester City": 338,
    "Southampton": 340,
    "Tottenham Hotspur": 73,
    "West Ham United": 563,
    "Wolverhampton Wanderers": 76,
    "AFC Bournemouth": 1044,
    "Brentford": 402,
    "Ipswich Town": 677
};

// 선수 카드 생성 함수
function createPlayerCard(player) {
    if (!player) return '';
    
    return `
        <div class="player-card" onclick="showPlayerDetails('${player.id}')">
            <h4>${player.name || '이름 없음'}</h4>
            <div class="player-info">
                <p>국적: ${player.nationality || '정보 없음'}</p>
                <p>생년월일: ${player.dateOfBirth ? formatDate(player.dateOfBirth) : '정보 없음'}</p>
            </div>
        </div>
    `;
}
// 팀 데이터 로드 함수
async function loadTeamData(teamName) {
    try {
        const teamId = teamIds[teamName];
        if (!teamId) {
            throw new Error('Team ID not found');
        }

        const [teamInfo, teamMatches] = await Promise.all([
            fetch(`/api/team/${teamId}`).then(res => res.json()),
            fetch(`/api/team/${teamId}/matches`).then(res => res.json())
        ]);
        
        console.log('Team Info:', teamInfo);
        console.log('Squad:', teamInfo.squad);
        
        const teamContent = document.getElementById('team-content');
        teamContent.innerHTML = `
            <section class="team-header">
                <img src="${teamLogos[teamName]}" alt="${teamName}" class="team-page-logo">
                <div class="team-title">
                    <h1>${teamNamesKorean[teamName]}</h1>
                    <p class="team-slogan">${teamInfo.shortName}</p>
                </div>
            </section>

            <section class="team-info">
                <div class="info-card stadium">
                    <h2>홈 구장</h2>
                    <p class="stadium-name">${teamInfo.venue}</p>
                    <p class="address">${teamInfo.address}</p>
                </div>
                
                <div class="info-card basic">
                    <h2>구단 정보</h2>
                    <p>설립: ${teamInfo.founded}년</p>
                    <p>구단 색상: ${teamInfo.clubColors}</p>
                    <p>웹사이트: <a href="${teamInfo.website}" target="_blank">${teamInfo.website}</a></p>
                    <p>연고지: ${teamInfo.area.name}</p>
                </div>
            </section>

            <section class="squad-section">
                <h2>선수단</h2>
                <div class="position-group">
                    <h3>골키퍼</h3>
                    <div class="players">
                        ${teamInfo.squad
                            .filter(player => player.position === 'Goalkeeper')
                            .map(player => createPlayerCard(player))
                            .join('')}
                    </div>
                </div>
                <div class="position-group">
                    <h3>수비수</h3>
                    <div class="players">
                        ${teamInfo.squad
                            .filter(player => 
                                player.position === 'Centre-Back' || 
                                player.position === 'Left-Back' || 
                                player.position === 'Right-Back'
                            )
                            .map(player => createPlayerCard(player))
                            .join('')}
                    </div>
                </div>
                <div class="position-group">
                    <h3>미드필더</h3>
                    <div class="players">
                        ${teamInfo.squad
                            .filter(player => 
                                player.position === 'Midfield' || 
                                player.position === 'Central Midfield' || 
                                player.position === 'Defensive Midfield' || 
                                player.position === 'Attacking Midfield'
                            )
                            .map(player => createPlayerCard(player))
                            .join('')}
                    </div>
                </div>
                <div class="position-group">
                    <h3>공격수</h3>
                    <div class="players">
                        ${teamInfo.squad
                            .filter(player => 
                                player.position === 'Offence' || 
                                player.position === 'Centre-Forward' || 
                                player.position === 'Left Winger' || 
                                player.position === 'Right Winger'
                            )
                            .map(player => createPlayerCard(player))
                            .join('')}
                    </div>
                </div>
            </section>

            <section class="matches-section">
                <h2>경기 일정</h2>
                <div class="matches-container">
                    ${teamMatches.matches ? teamMatches.matches.slice(0, 5).map(match => `
                        <div class="match-card">
                            <div class="match-date">
                                ${formatDate(match.utcDate)}
                            </div>
                            <div class="match-teams">
                                <span class="home-team">${match.homeTeam.name}</span>
                                <span class="vs">VS</span>
                                <span class="away-team">${match.awayTeam.name}</span>
                            </div>
                            <div class="match-info">
                                <span class="competition">${match.competition.name}</span>
                                <span class="status">${formatMatchStatus(match.status)}</span>
                            </div>
                        </div>
                    `).join('') : '<p>예정된 경기가 없습니다.</p>'}
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading team data:', error);
        const teamContent = document.getElementById('team-content');
        teamContent.innerHTML = `
            <div class="error-message">
                <h2>데이터를 불러오는 중 오류가 발생했습니다</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// 선수 상세 정보 표시 함수
async function showPlayerDetails(playerId) {
    try {
        const modalContent = document.getElementById('playerModalContent');
        modalContent.innerHTML = `
            <div class="player-detail">
                <h2>선수 정보 로딩중...</h2>
            </div>
        `;

        const modal = document.getElementById('playerModal');
        modal.style.display = 'block';

        const response = await fetch(`/api/player/${playerId}`);
        const playerData = await response.json();
        console.log('Player Details - Full Data:', playerData);
        console.log('Available Fields:', Object.keys(playerData));
        console.table(playerData); // 데이터 확인용
        
        modalContent.innerHTML = `
            <div class="player-detail">
                <div class="player-header">
                    <h2>${playerData.name}</h2>
                    <div class="player-number">${playerData.shirtNumber || ''}</div>
                </div>
                
                <div class="player-info-detail">
                    <div class="info-section">
                        <h3>기본 정보</h3>
                        <p><strong>포지션:</strong> ${playerData.position}</p>
                        <p><strong>국적:</strong> ${playerData.nationality}</p>
                        <p><strong>생년월일:</strong> ${formatDate(playerData.dateOfBirth)}</p>
                        <p><strong>나이:</strong> ${calculateAge(playerData.dateOfBirth)}세</p>
                    </div>

                    <div class="info-section">
                        <h3>팀 정보</h3>
                        <p><strong>소속팀:</strong> ${playerData.currentTeam?.name || '정보 없음'}</p>
                        <p><strong>계약 시작일:</strong> ${playerData.currentTeam?.contract?.start ? formatDate(playerData.currentTeam.contract.start) : '정보 없음'}</p>
                        <p><strong>계약 만료일:</strong> ${playerData.currentTeam?.contract?.until ? formatDate(playerData.currentTeam.contract.until) : '정보 없음'}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching player details:', error);
        modalContent.innerHTML = `
            <div class="error-message">
                <h2>선수 정보를 불러오는데 실패했습니다</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// 모달 닫기 함수
function closePlayerModal() {
    const modal = document.getElementById('playerModal');
    modal.style.display = 'none';
}

// 나이 계산 함수
function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// 날짜 포맷 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// 경기 상태 포맷 함수
function formatMatchStatus(status) {
    const statusMap = {
        SCHEDULED: '예정',
        LIVE: '진행중',
        IN_PLAY: '진행중',
        PAUSED: '중단',
        FINISHED: '종료',
        POSTPONED: '연기',
        CANCELLED: '취소',
        SUSPENDED: '중단'
    };
    return statusMap[status] || status;
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamName = urlParams.get('name');
    
    if (teamName && teamIds[teamName]) {
        loadTeamData(teamName);
    } else {
        const teamContent = document.getElementById('team-content');
        teamContent.innerHTML = `
            <div class="error-message">
                <h2>팀을 찾을 수 없습니다</h2>
                <p>올바른 팀 이름을 입력해주세요.</p>
            </div>
        `;
    }
});