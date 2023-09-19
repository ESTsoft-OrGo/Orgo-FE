import { getCookie } from "./util.js";

const postdata = JSON.parse(localStorage.getItem("edit"));
const $textarea = document.querySelector('.post-contents');
const $imageInput = document.querySelector('.image-input');
const $image_preview = document.querySelector('.image-preview')
const $post_title = document.querySelector('.post-title')
const $post_contents = document.querySelector('.post-contents')
const $backBtn = document.querySelector('.post-back');
const $saveBtn = document.querySelector('.post-save')
const formData = new FormData();
const regexPattern = /^images\[(\w+)\]$/; 


// 줄바꿈 시 자동으로 height 늘어나는 함수
$textarea.oninput = (event) => {
    const $target = event.target;
    $target.style.height = 0;
    $target.style.height = $target.scrollHeight + 'px';
};

const content_hight = () => {
    $post_contents.style.height = $post_contents.scrollHeight + 'px';
}

// Comment 작성
const postEdit = async () => {
    
    const url = `http://127.0.0.1:8000/post/edit/${postdata.id}/`;
    const access = getCookie('access')

    const imgs = $imageInput.files;

    renameFormDataFields(formData, regexPattern, 'images');
    formData.append('title', $post_title.value);
    formData.append('content', $post_contents.value);
    formData.append('deleted_images', JSON.stringify(delete_img));

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


function renameFormDataFields(formData, regexPattern, newFieldName) {
    Array.from(formData.keys()).forEach((key) => {
        const matches = key.match(regexPattern);
        if (matches && matches.length > 0) {
        const uniqueKey = matches[1]; 

        formData.append(newFieldName, formData.get(`images[${uniqueKey}]`)); 
    }
    });
}

function generateUniqueKey() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

let delete_img = [];
const setEdit = () => {
    $post_contents.innerText = postdata.content
    $post_contents.value = postdata.content

    if(postdata.images.length > 0){
        for (const image of postdata.images){
            const img_box = document.createElement('div')
            const img = document.createElement('img')
            const deleteBtn = document.createElement('button');
            
            img.classList = "post-image"
            img.setAttribute("src", `https://myorgobucket.s3.ap-northeast-2.amazonaws.com${image.image}`);
            img_box.className = 'img_box'
            img_box.append(img)
            $image_preview.append(img_box)
            img_box.append(deleteBtn);
            deleteBtn.textContent = 'X';
            deleteBtn.classList = 'delete-image-button';
            deleteBtn.addEventListener('click', () => {
                img_box.remove();
                delete_img.push(image.image)
            });
        }
    }
    $post_title.value = postdata.title
    content_hight()
    localStorage.removeItem('edit');
};


// 이미지 업로드 핸들러 함수
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
            if ([...formData.keys()].length > 0){
                formData.append('img_edit', "true")
            }
            reader.readAsDataURL(file);
        }
    });

    event.target.value = '';
}


const backFunc = () => {
    window.history.back();
}

setEdit()
$saveBtn.addEventListener('click',postEdit)
$imageInput.addEventListener("change", handleImageUpload);
$backBtn.addEventListener('click', backFunc)