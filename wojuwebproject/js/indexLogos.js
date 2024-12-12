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

function initTeamLogos() {
    const teamsContainer = document.getElementById('teams-container');
    if (!teamsContainer) return;
    
    teamsContainer.innerHTML = '';
    
    Object.entries(teamLogos).forEach(([teamName, logoUrl]) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        
        // teaminfo.html로 링크 변경
        const link = document.createElement('a');
        link.href = `teaminfo.html?name=${encodeURIComponent(teamName)}`;
        link.style.textDecoration = 'none';
        
        const logo = document.createElement('img');
        logo.src = logoUrl;
        logo.alt = `${teamName} logo`;
        logo.className = 'team-logo';
        
        const name = document.createElement('span');
        name.className = 'team-name';
        name.textContent = teamNamesKorean[teamName] || teamName;
        
        link.appendChild(logo);
        link.appendChild(name);
        teamDiv.appendChild(link);
        teamsContainer.appendChild(teamDiv);
    });
}

document.addEventListener('DOMContentLoaded', initTeamLogos);
window.addEventListener('hashchange', initTeamLogos);
window.addEventListener('popstate', initTeamLogos);

setInterval(() => {
    const teamsContainer = document.getElementById('teams-container');
    if (teamsContainer && teamsContainer.children.length === 0) {
        initTeamLogos();
    }
}, 1000);

window.initTeamLogos = initTeamLogos;