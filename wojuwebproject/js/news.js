async function fetchNews() {
    try {
        const response = await fetch('http://localhost:3000/api/news');
        const data = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        const updateTime = document.querySelector('.update-time');
        
        // 업데이트 시간 설정
        updateTime.textContent = `마지막 업데이트: ${new Date().toLocaleString()}`;
        
        // 뉴스 카드 생성
        const newsHTML = data.items.map(item => `
            <div class="news-card">
                <h3 class="news-title">
                    <a href="${item.link}" target="_blank">
                        ${item.title.replace(/(<([^>]+)>)|&quot;/gi, "")}
                    </a>
                </h3>
                <p class="news-description">
                    ${item.description.replace(/(<([^>]+)>)|&quot;/gi, "")}
                </p>
                <div class="news-meta">
                    <span class="news-source">
                        ${new Date(item.pubDate).toLocaleDateString()}
                    </span>
                    <a href="${item.originallink}" target="_blank" class="news-link">
                        원문 보기
                    </a>
                </div>
            </div>
        `).join('');
        
        newsContainer.innerHTML = newsHTML;
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerHTML = `
            <div class="error-message">
                뉴스를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
            </div>
        `;
    }
}

// 페이지 로드 시 뉴스 가져오기
document.addEventListener('DOMContentLoaded', fetchNews);

// 5분마다 뉴스 업데이트 (선택사항)
setInterval(fetchNews, 5 * 60 * 1000);