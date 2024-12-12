import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// HTML 요소 선택
const menuBtn = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const teamsContainer = document.getElementById('teams-container');
const newsContainer = document.getElementById('news-container');

// 햄버거 메뉴 토글
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Firestore 데이터베이스 참조
const db = getFirestore();

// 팀 정보 로드
async function loadTeams() {
    try {
        const teamsCollection = collection(db, 'teams');
        const teamSnapshot = await getDocs(teamsCollection);
        let teamsHTML = '';
        
        teamSnapshot.forEach((doc) => {
            const team = doc.data();
            teamsHTML += `
                <div class="team-card">
                    <img src="${team.logo}" alt="${team.name}" onerror="this.src='images/default-team.png'">
                    <h3>${team.name}</h3>
                    <p>설립: ${team.founded}</p>
                    <p>홈구장: ${team.stadium}</p>
                </div>
            `;
        });
        
        teamsContainer.innerHTML = teamsHTML;
    } catch (error) {
        console.error("팀 데이터 로드 중 오류 발생:", error);
        teamsContainer.innerHTML = '<p>팀 정보를 불러오는 중 오류가 발생했습니다.</p>';
    }
}

// 네이버 뉴스 API로 뉴스 로드 (메인 페이지용 - 4개만 표시)
async function loadNews() {
    try {
        const response = await fetch('/api/news/preview');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = data.items.map(item => `
                <div class="news-item">
                    <h3 class="news-title">
                        <a href="${item.link}" target="_blank">
                            ${item.title.replace(/(<([^>]+)>)|&quot;/gi, "")}
                        </a>
                    </h3>
                    <p>${item.description.replace(/(<([^>]+)>)|&quot;/gi, "")}</p>
                    <div class="news-meta">
                        <span class="date">${new Date(item.pubDate).toLocaleDateString()}</span>
                        <a href="${item.originallink || item.link}" target="_blank" class="read-more">원문 보기</a>
                    </div>
                </div>
            `).join('');
        } else {
            throw new Error('No news items found');
        }
    } catch (error) {
        console.error('뉴스 데이터 로드 중 오류 발생:', error);
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '<div class="error-message">뉴스를 불러오는데 실패했습니다.</div>';
    }
}

// 모든 구단 로고 표시
function displayAllTeamLogos() {
    const logosGrid = document.getElementById('logos-grid');
    if (!logosGrid) return;

    Object.entries(indexLogos).forEach(([teamName, logoUrl]) => {
        const logoBox = document.createElement('div');
        logoBox.className = 'logo-box';
        
        logoBox.innerHTML = `
            <img src="${logoUrl}" alt="${teamName}" onerror="this.src='images/default-team.png'">
            <p>${teamName}</p>
        `;
        
        logosGrid.appendChild(logoBox);
    });
}

// 스크롤 애니메이션
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            sectionObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.classList.add('hidden');
    sectionObserver.observe(section);
});

// 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href');
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
});

// Firebase Auth 관련 코드
const auth = getAuth();

// 모달 함수들
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
}

// 회원가입 처리
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert('회원가입이 완료되었습니다!');
        closeSignupModal();
    } catch (error) {
        alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    }
});

// 로그인 처리
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('로그인되었습니다!');
        closeLoginModal();
        updateAuthButtons(true);
    } catch (error) {
        alert('로그인 중 오류가 발생했습니다: ' + error.message);
    }
});

// 인증 버튼 업데이트
function updateAuthButtons(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span class="user-email">${auth.currentUser.email}</span>
            <button class="login-btn" onclick="handleLogout()">로그아웃</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="login-btn" onclick="openLoginModal()">로그인</button>
            <button class="signup-btn" onclick="openSignupModal()">회원가입</button>
        `;
    }
}

// 로그아웃 처리
window.handleLogout = async () => {
    try {
        await signOut(auth);
        alert('로그아웃되었습니다.');
        updateAuthButtons(false);
    } catch (error) {
        alert('로그아웃 중 오류가 발생했습니다: ' + error.message);
    }
};

// 인증 상태 변경 감지
onAuthStateChanged(auth, (user) => {
    updateAuthButtons(!!user);
});

// 모달 외부 클릭시 닫기
window.onclick = (event) => {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
};

// 전역 함수들 등록
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadTeams();
    loadNews();
    displayAllTeamLogos();  // 추가된 부분

    // 5분마다 뉴스 업데이트
    setInterval(loadNews, 5 * 60 * 1000);
});