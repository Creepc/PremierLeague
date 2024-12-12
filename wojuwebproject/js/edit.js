import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

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

// 인증 상태 확인
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
        
        // 로그아웃 버튼 이벤트 리스너
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'noticeboard.html';
            } catch (error) {
                console.error('로그아웃 오류:', error);
                alert('로그아웃에 실패했습니다.');
            }
        });

        loadPost();  // 게시글 로드
    } else {
        // 비로그인 상태에서 접근 시 게시판으로 리다이렉트
        alert('로그인이 필요합니다.');
        window.location.href = 'noticeboard.html';
    }
});

// 이미지 미리보기
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.style.display = 'block';
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 게시글 불러오기
async function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'noticeboard.html';
        return;
    }

    try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (!postDoc.exists()) {
            alert('존재하지 않는 게시글입니다.');
            window.location.href = 'noticeboard.html';
            return;
        }

        const postData = postDoc.data();

        // 작성자 확인
        if (postData.authorId !== auth.currentUser?.uid) {
            alert('수정 권한이 없습니다.');
            window.location.href = 'noticeboard.html';
            return;
        }

        // 폼에 데이터 채우기
        document.getElementById('category').value = postData.category;
        document.getElementById('title').value = postData.title;
        document.getElementById('content').value = postData.content;

        if (postData.imageUrl) {
            imagePreview.src = postData.imageUrl;
            imagePreview.style.display = 'block';
        }

    } catch (error) {
        console.error('게시글 로드 오류:', error);
        alert('게시글을 불러오는데 실패했습니다.');
    }
}

// 폼 제출 처리
document.getElementById('writeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const postId = new URLSearchParams(window.location.search).get('id');

    try {
        let imageUrl = null;
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const storageRef = ref(storage, `post-images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const postDoc = await getDoc(doc(db, 'posts', postId));
        const currentData = postDoc.data();

        await updateDoc(doc(db, 'posts', postId), {
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            imageUrl: imageUrl || currentData.imageUrl,  // 새 이미지가 없으면 기존 이미지 유지
            updatedAt: serverTimestamp()
        });

        alert('게시글이 수정되었습니다.');
        window.location.href = `post.html?id=${postId}`;

    } catch (error) {
        console.error('게시글 수정 오류:', error);
        alert('게시글 수정에 실패했습니다.');
    }
});