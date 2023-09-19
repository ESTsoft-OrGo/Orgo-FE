import { getCookie } from "./util.js";
const $imageInput = document.querySelector('.image-input');
const $image_preview = document.querySelector('.image-preview');
const formData = new FormData();
const regexPattern = /^images\[(\w+)\]$/; 
const $textarea = document.querySelector('.post-contents');
const $post_title = document.querySelector('.post-title');
const $post_contents = document.querySelector('.post-contents');
const $backBtn = document.querySelector('.post-back');
const $saveBtn = document.querySelector('.post-save');

$textarea.oninput = (event) => {
    const $target = event.target;
    $target.style.height = 0;
    $target.style.height = $target.scrollHeight + 'px';
};


function generateUniqueKey() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function handleImageUpload(event) {
    const newFiles = event.target.files;

    if (newFiles.length === 0) {
        return false;
    }

    Array.from(newFiles).forEach((file) => {
        if (file.size > 250000) {
            alert('파일 크기는 2.5MB 이내로 가능합니다.');
            event.target.value = '';
        } else {
            const uniqueKey = generateUniqueKey(); 
            
            const reader = new FileReader();
            reader.onload = function (event) {
                const img_box = document.createElement('div');
                const img = document.createElement('img');
                const deleteBtn = document.createElement('button');

                img.classList = "post-image";
                img.setAttribute("src", event.target.result);
                img_box.className = 'img_box';
                img_box.append(img);
                img_box.append(deleteBtn);
                img_box.setAttribute('data-key', uniqueKey); 
                $image_preview.append(img_box);

                deleteBtn.textContent = 'X';
                deleteBtn.classList = 'delete-image-button';
                deleteBtn.addEventListener('click', () => {
                    const imageKey = img_box.getAttribute('data-key');
                    img_box.remove(); 
                    event.target.value = ''; 
                    formData.delete(`images[${uniqueKey}]`);
                });
            };

            formData.append(`images[${uniqueKey}]`, file);
            const fileToRead = formData.get(`images[${uniqueKey}]`);
            
            reader.readAsDataURL(file);
        }
    });

    event.target.value = '';
}
function renameFormDataFields(formData, regexPattern, newFieldName) {
    Array.from(formData.keys()).forEach((key) => {
        const matches = key.match(regexPattern);
        if (matches && matches.length > 0) {
        const uniqueKey = matches[1]; 

        formData.append(newFieldName, formData.get(`images[${uniqueKey}]`));
    }
    });
}


// Comment 작성
const postWrite = async () => {
    const url = 'http://127.0.0.1:8000/post/write/';
    const access = getCookie('access');
    renameFormDataFields(formData, regexPattern, 'images');
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
        alert(data.message);
        location.href = '/src/view/board.html'
    })
    .catch((err) => {
        console.log(err);
    });
};

const backFunc = () => {
    window.history.back();
};

$imageInput.addEventListener("change", handleImageUpload);
$saveBtn.addEventListener('click', postWrite);
$backBtn.addEventListener('click', backFunc);