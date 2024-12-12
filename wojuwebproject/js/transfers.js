async function fetchTransfers() {
    try {
        const response = await fetch('/api/transfers');
        const data = await response.json();
        console.log('Transfer data:', data);

        if (data && data.transfers && data.transfers.length > 0) {
            const transfersList = document.getElementById('transfers-list');
            
            transfersList.innerHTML = data.transfers.map(transfer => `
                <tr>
                    <td>
                        <div class="player-info">
                            <span>${transfer.name}</span>
                        </div>
                    </td>
                    <td>
                        <div class="team-info">
                            ${transfer.fromTeam.name}
                        </div>
                    </td>
                    <td>
                        <div class="team-info">
                            ${transfer.toTeam.name}
                        </div>
                    </td>
                    <td>${transfer.position || '-'}</td>
                    <td>${transfer.fee || '미공개'}</td>
                    <td>${transfer.contractUntil || '-'}</td>
                    <td>${transfer.date || '-'}</td>
                </tr>
            `).join('');
        } else {
            document.getElementById('transfers-list').innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">
                        현재 이적 정보가 없습니다.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('transfers-list').innerHTML = `
            <tr>
                <td colspan="7" class="error">
                    이적 정보를 불러오는데 실패했습니다.
                </td>
            </tr>
        `;
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', fetchTransfers);

// 나머지 코드는 그대로 유지

// 나머지 코드는 그대로 유지...

async function fetchTransferNews() {
    try {
        const response = await fetch('/api/transfer-news');
        const data = await response.json();
        
        const newsContainer = document.getElementById('transfer-news-container');
        
        newsContainer.innerHTML = data.items.map(item => `
            <div class="news-card">
                <h3 class="news-title">
                    <a href="${item.link}" target="_blank">
                        ${item.title.replace(/(<([^>]+)>)|&quot;/gi, "")}
                    </a>
                </h3>
                <p>${item.description.replace(/(<([^>]+)>)|&quot;/gi, "").slice(0, 100)}...</p>
                <span class="news-date">${new Date(item.pubDate).toLocaleDateString()}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching transfer news:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTransfers();
    fetchTransferNews();
    
    // 5분마다 데이터 업데이트
    setInterval(() => {
        fetchTransfers();
        fetchTransferNews();
    }, 5 * 60 * 1000);
});