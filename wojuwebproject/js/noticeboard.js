import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, where, serverTimestamp, limit } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDoOJnpeNjFIs2-kMXV2h4L-1ndd8frhQc",
    authDomain: "web-project-e55ab.firebaseapp.com",
    projectId: "web-project-e55ab",
    storageBucket: "web-project-e55ab.firebasestorage.app",
    messagingSenderId: "468612045072",
    appId: "1:468612045072:web:b3a5bba4d11f4baac22d95",
    measurementId: "G-QYMDX2Y1MT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM 요소
const boardList = document.getElementById('board-list');
const writeButton = document.getElementById('writeButton');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const searchType = document.getElementById('searchType');
const messagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const userEmailSpan = document.getElementById('user-email');

// 인증 상태 감지
onAuthStateChanged(auth, (user) => {
    const beforeLogin = document.getElementById('beforeLogin');
    const afterLogin = document.getElementById('afterLogin');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // 로그인 상태
        beforeLogin.style.display = 'none';
        afterLogin.style.display = 'block';
        userEmail.textContent = user.email;
        writeButton.style.display = 'block';
        
        // 로그아웃 버튼 이벤트 리스너
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.reload();
            } catch (error) {
                console.error('로그아웃 오류:', error);
                alert('로그아웃에 실패했습니다.');
            }
        });

        // 채팅 메시지 로드
        loadMessages();
    } else {
        // 로그아웃 상태
        beforeLogin.style.display = 'block';
        afterLogin.style.display = 'none';
        writeButton.style.display = 'none';
        userEmail.textContent = '로그인이 필요합니다';
    }

    // 게시글 로드
    loadPosts();
});

// 게시글 로드
function loadPosts() {
    let q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    // 카테고리 필터 적용
    const category = categoryFilter.value;
    if (category) {
        q = query(q, where('category', '==', category));
    }

    // 검색 필터 적용
    const searchValue = searchInput.value.trim();
    if (searchValue) {
        onSnapshot(q, (snapshot) => {
            displayFilteredPosts(snapshot.docs, searchValue);
        });
    } else {
        onSnapshot(q, (snapshot) => {
            displayPosts(snapshot);
        });
    }
}

// 게시글 표시
function displayPosts(snapshot) {
    boardList.innerHTML = '';
    snapshot.forEach((doc, index) => {
        const post = doc.data();
        const row = createPostRow(doc, post, snapshot.size - index);
        boardList.appendChild(row);
    });
}

// 검색 필터링된 게시글 표시
function displayFilteredPosts(docs, searchValue) {
    boardList.innerHTML = '';
    const searchField = searchType.value;
    const filteredDocs = docs.filter(doc => {
        const post = doc.data();
        const fieldValue = post[searchField]?.toLowerCase() || '';
        return fieldValue.includes(searchValue.toLowerCase());
    });

    filteredDocs.forEach((doc, index) => {
        const post = doc.data();
        const row = createPostRow(doc, post, filteredDocs.length - index);
        boardList.appendChild(row);
    });
}

// 게시글 행 생성
function createPostRow(doc, post, number) {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';
    
    row.addEventListener('click', () => {
        window.location.href = `post.html?id=${doc.id}`;
    });

    row.innerHTML = `
        <td>${number}</td>
        <td>
            <div style="display: flex; align-items: center;">
                ${post.category ? `<span class="category-tag">[${post.category}]</span>` : ''}
                <span class="post-title">${post.title}</span>
                ${post.imageUrl ? '<span class="image-icon">📷</span>' : ''}
                <span class="comment-count">[${post.commentCount || 0}]</span>
            </div>
        </td>
        <td>${post.author}</td>
        <td>${new Date(post.timestamp?.toDate()).toLocaleDateString()}</td>
        <td>${post.views || 0}</td>
    `;
    
    return row;
}

// 채팅 메시지 관련 함수들
function loadMessages() {
    const q = query(
        collection(db, 'chat-messages'), 
        orderBy('timestamp', 'asc'),  // 시간순 정렬
        limit(50)
    );

    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = '';
        
        // 메시지들을 배열로 변환 후 추가
        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = createMessageElement(message);
            messagesDiv.appendChild(messageElement);
        });

        // 스크롤을 항상 아래로 유지
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

function createMessageElement(message) {
    const div = document.createElement('div');
    const isCurrentUser = message.userId === auth.currentUser?.uid;
    div.className = `message ${isCurrentUser ? 'sent' : 'received'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message.text;

    const messageInfo = document.createElement('div');
    messageInfo.className = 'message-info';
    messageInfo.textContent = isCurrentUser ? '나' : message.userEmail.split('@')[0];

    div.appendChild(messageContent);
    div.appendChild(messageInfo);

    return div;
}

async function sendMessage() {
    if (!auth.currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const messageText = messageInput.value.trim();
    if (!messageText) return;

    try {
        await addDoc(collection(db, 'chat-messages'), {
            text: messageText,
            userId: auth.currentUser.uid,
            userEmail: auth.currentUser.email,
            timestamp: serverTimestamp()
        });
        
        messageInput.value = '';
        
        // 메시지 전송 후 스크롤 아래로
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error('메시지 전송 오류:', error);
        alert('메시지 전송에 실패했습니다.');
    }
}

// 글쓰기 버튼 이벤트 리스너
writeButton.addEventListener('click', () => {
    if (!auth.currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }
    window.location.href = 'write.html';
});

// 검색 관련 이벤트 리스너
searchButton.addEventListener('click', loadPosts);
categoryFilter.addEventListener('change', loadPosts);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPosts();
});

// 채팅 관련 이벤트 리스너
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 초기 로드
loadPosts();