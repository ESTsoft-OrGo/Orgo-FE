const $imageInput = document.querySelector('.image-input')
const $userImage = document.querySelector('.user-profile-img');
const $relatedBtn = document.querySelectorAll('.related');

const previewImage = (event) => {
    
    const file = event.target.files[0];

    if (file.size > 250000){
        alert('파일크기는 2.5MB 이내로 가능합니다.')
        event.target.value = ''
    } else{
        let reader = new FileReader();

        reader.onload = function (event) {
            $userImage.setAttribute("src", event.target.result);
        };
        reader.readAsDataURL(file);
    }
    
};

const relatedClick = (e) => {

    const target = e.target

    $relatedBtn.forEach(element => {
        element.classList = 'related'
    });

    target.classList = 'related clicked'
}

$imageInput.addEventListener("change", previewImage);
$relatedBtn.forEach(element => {
    element.addEventListener('click',relatedClick)
});