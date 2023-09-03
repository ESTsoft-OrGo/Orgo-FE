import { getCookie } from "./util.js";

const $textarea = document.querySelector('.post-contents');
const $imageInput = document.querySelector('.image-input');
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
    
    const url = 'https://api.withorgo.site/post/write/';
    const access = getCookie('access')
    const formData = new FormData();
    const imgs = $imageInput.files;
    if(imgs){
        for (const file of imgs) {
            formData.append('images', file);
        }
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
    const file = event.target.files;
    const $image_preview = document.querySelector('.image-preview')
    $image_preview.innerHTML = ""
    if (file.length === 0) {  
        return false;
    } else {
        const {currentTarget: { files },} = event;
        for (const file of files) {
            if (file.size > 250000){
                alert('파일크기는 2.5MB 이내로 가능합니다.')
                event.target.value = ''
            } else {
                let reader = new FileReader();
                reader.onload = function (event) {
                    const img_box = document.createElement('div')
                    const img = document.createElement('img')
                    img.classList = "post-image"
                    img.setAttribute("src", event.target.result);
                    img_box.className = 'img_box'
                    img_box.append(img)
                    $image_preview.append(img_box)
                };
                reader.readAsDataURL(file);
            }
        }
    }
};

const backFunc = () => {
    window.history.back();
}

$saveBtn.addEventListener('click',postWrite)
$imageInput.addEventListener("change", previewImage);
$backBtn.addEventListener('click', backFunc)