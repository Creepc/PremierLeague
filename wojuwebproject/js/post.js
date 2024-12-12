import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    addDoc, 
    onSnapshot, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    deleteObject 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

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
const storage = getStorage(app);

let currentUser = null;
let currentPostId = null;

// 인증 상태 확인
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const beforeLogin = document.getElementById('beforeLogin');
    const afterLogin = document.getElementById('afterLogin');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user) {
        // 로그인 상태
        beforeLogin.style.display = 'none';
        afterLogin.style.display = 'block';
        userEmail.textContent = user.email;
        document.getElementById('commentInput').disabled = false;
        document.getElementById('submitComment').disabled = false;
        
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
    } else {
        // 로그아웃 상태
        beforeLogin.style.display = 'block';
        afterLogin.style.display = 'none';
        document.getElementById('commentInput').disabled = true;
        document.getElementById('submitComment').disabled = true;
        document.getElementById('commentInput').placeholder = '댓글을 작성하려면 로그인이 필요합니다';
    }

    loadPost();  // 게시글 로드
});

// 게시글 로드
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');

    if (!currentPostId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'noticeboard.html';
        return;
    }

    try {
        const postDoc = await getDoc(doc(db, 'posts', currentPostId));
        
        if (!postDoc.exists()) {
            alert('존재하지 않는 게시글입니다.');
            window.location.href = 'noticeboard.html';
            return;
        }

        const postData = postDoc.data();

        // 게시글 정보 표시
        document.getElementById('category').textContent = postData.category;
        document.getElementById('title').textContent = postData.title;
        document.getElementById('author').textContent = postData.author;
        document.getElementById('date').textContent = new Date(postData.timestamp?.toDate()).toLocaleDateString();
        document.getElementById('content').textContent = postData.content;
        document.getElementById('views').textContent = `조회수: ${postData.views || 0}`;

        // 이미지가 있으면 표시
        if (postData.imageUrl) {
            const postImage = document.getElementById('postImage');
            postImage.src = postData.imageUrl;
            postImage.style.display = 'block';
        }

        // 작성자인 경우 수정/삭제 버튼 추가
        if (currentUser && postData.authorId === currentUser.uid) {
            const buttonGroup = document.getElementById('buttonGroup');
            buttonGroup.insertAdjacentHTML('afterbegin', `
                <button class="btn btn-danger" onclick="deletePost()">삭제</button>
                <button class="btn btn-primary" onclick="location.href='edit.html?id=${currentPostId}'">수정</button>
            `);
        }

        // 조회수 증가
        await updateDoc(doc(db, 'posts', currentPostId), {
            views: (postData.views || 0) + 1
        });

        loadComments();

    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글을 불러오는데 실패했습니다.');
    }
}

// 댓글 로드
function loadComments() {
    const q = query(
        collection(db, 'comments'), 
        where('postId', '==', currentPostId),
        orderBy('timestamp', 'desc')
    );

    onSnapshot(q, (snapshot) => {
        const commentList = document.getElementById('commentList');
        commentList.innerHTML = '';

        if (snapshot.empty) {
            commentList.innerHTML = '<div class="no-comments">첫 번째 댓글을 작성해보세요!</div>';
            return;
        }

        snapshot.forEach((doc) => {
            const comment = doc.data();
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-info">
                    <span>${comment.author}</span>
                    <span>${comment.timestamp 
                        ? new Date(comment.timestamp.toDate()).toLocaleString() 
                        : '방금 전'}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                ${comment.authorId === currentUser?.uid ? `
                    <div class="comment-actions">
                        <button class="btn-delete-comment" onclick="deleteComment('${doc.id}')">삭제</button>
                    </div>
                ` : ''}
            `;
            commentList.appendChild(commentElement);
        });
    });
}

// 댓글 작성
document.getElementById('submitComment').addEventListener('click', async () => {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const commentText = document.getElementById('commentInput').value.trim();
    if (!commentText) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    try {
        await addDoc(collection(db, 'comments'), {
            postId: currentPostId,
            text: commentText,
            author: currentUser.email,
            authorId: currentUser.uid,
            timestamp: serverTimestamp()
        });

        // 게시글의 댓글 수 업데이트
        const postRef = doc(db, 'posts', currentPostId);
        const postDoc = await getDoc(postRef);
        
        if (postDoc.exists()) {
            await updateDoc(postRef, {
                commentCount: (postDoc.data().commentCount || 0) + 1
            });
        }

        document.getElementById('commentInput').value = '';

    } catch (error) {
        console.error('댓글 작성 오류:', error);
        alert('댓글 작성에 실패했습니다.');
    }
});

// 댓글 삭제
window.deleteComment = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
        await deleteDoc(doc(db, 'comments', commentId));
        
        // 게시글의 댓글 수 감소
        const postRef = doc(db, 'posts', currentPostId);
        const postDoc = await getDoc(postRef);
        
        if (postDoc.exists()) {
            await updateDoc(postRef, {
                commentCount: Math.max((postDoc.data().commentCount || 0) - 1, 0)
            });
        }

        alert('댓글이 삭제되었습니다.');
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        alert('댓글 삭제에 실패했습니다.');
    }
};

// post.js에서 deletePost 함수 수정
window.deletePost = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        // 먼저 게시글 정보 가져오기
        const postRef = doc(db, 'posts', currentPostId);
        const postDoc = await getDoc(postRef);
        const postData = postDoc.data();

        // 이미지가 있으면 Storage에서 이미지 삭제
        if (postData.imageUrl) {
            try {
                const imageRef = ref(storage, postData.imageUrl);
                await deleteObject(imageRef);
            } catch (error) {
                console.error('이미지 삭제 오류:', error);
                // 이미지 삭제 실패해도 게시글 삭제는 계속 진행
            }
        }

        // 관련 댓글들 삭제
        const commentsQuery = query(collection(db, 'comments'), where('postId', '==', currentPostId));
        const commentsSnapshot = await getDocs(commentsQuery);
        
        // 댓글 삭제 Promise 배열 생성
        const deletePromises = commentsSnapshot.docs.map(commentDoc => 
            deleteDoc(doc(db, 'comments', commentDoc.id))
        );
        
        // 모든 댓글 삭제 완료 대기
        await Promise.all(deletePromises);

        // 마지막으로 게시글 삭제
        await deleteDoc(postRef);

        alert('게시글이 삭제되었습니다.');
        window.location.href = 'noticeboard.html';
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        alert('게시글 삭제에 실패했습니다. 오류: ' + error.message);
    }
};