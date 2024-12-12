import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
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

// 로그인 상태 확인
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

// 폼 제출 처리
const writeForm = document.getElementById('writeForm');
writeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        let imageUrl = null;
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const storageRef = ref(storage, `post-images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        const postData = {
            category: document.getElementById('category').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            imageUrl: imageUrl,
            author: auth.currentUser.email,
            authorId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            views: 0,
            commentCount: 0
        };

        await addDoc(collection(db, 'posts'), postData);
        alert('게시글이 등록되었습니다.');
        window.location.href = 'noticeboard.html';

    } catch (error) {
        console.error('게시글 등록 오류:', error);
        alert('게시글 등록에 실패했습니다.');
    }
});