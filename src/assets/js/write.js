const $textarea = document.querySelector('.post-contents');
const $imageInput = document.querySelector('.image-input');
const $postImage = document.querySelector('.post-image');
const $backBtn = document.querySelector('.post-back');

// 줄바꿈 시 자동으로 height 늘어나는 함수
$textarea.oninput = (event) => {
    const $target = event.target;
    $target.style.height = 0;
    $target.style.height = $target.scrollHeight + 'px';
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

$imageInput.addEventListener("change", previewImage);
$backBtn.addEventListener('click', backFunc)