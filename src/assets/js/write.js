import { getCookie } from "./util.js";

const $textarea = document.querySelector('.post-contents');
const $imageInput = document.querySelector('.image-input');
const $postImage = document.querySelector('.post-image');
const $post_title = document.querySelector('.post-title')
const $post_contents = document.querySelector('.post-contents')
const $backBtn = document.querySelector('.post-back');
const $saveBtn = document.querySelector('.post-save')

// 줄바꿈 시 자동으로 height 늘어나는 함수
$textarea.oninput = (event) => {
    const $target = event.target;
    $target.style.height = 0;
    $target.style.height = $target.scrollHeight + 'px';
};

// Comment 작성
const postWrite = async () => {
    
    const url = 'http://127.0.0.1:8000/post/write/';
    const access = getCookie('access')
    const formData = new FormData();
    const img = $imageInput.files[0]

    if (img){
        formData.append('postImage', img);
    }
    formData.append('title', $post_title.value);
    formData.append('content', $post_contents.value);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.message)
            location.href = '/src/view/board.html'
        })
        .catch((err) => {
            console.log(err);
        });
};

const previewImage = (event) => {
    const file = event.target.files[0];

    if (file.size > 250000){
        alert('파일크기는 2.5MB 이내로 가능합니다.')
        event.target.value = ''
    } else{
        let reader = new FileReader();

        reader.onload = function (event) {
            $postImage.setAttribute("src", event.target.result);
        };
        reader.readAsDataURL(file);
    }
    
};

const backFunc = () => {
    window.history.back();
}

$saveBtn.addEventListener('click',postWrite)
$imageInput.addEventListener("change", previewImage);
$backBtn.addEventListener('click', backFunc)