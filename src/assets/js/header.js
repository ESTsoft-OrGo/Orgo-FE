import {getWithExpire,deleteCookie} from "./util.js"

const $logout_btn = document.querySelector('.logout_btn')

// 로그인이 되있는지 확인
const is_logined = () => {

    if (getWithExpire('user')) {
        const is_logined = document.querySelectorAll('.is_logined')
        const profile = JSON.parse(getWithExpire('user'))
        const $avatar_img = document.querySelector('.avatar_img')
        
        is_logined.forEach(element => {
            element.style.display = 'flex'
        });
        
        if (profile.profileImage){
            $avatar_img.src = 'http://127.0.0.1:8000'+ profile.profileImage
        } else {
            $avatar_img.src = '/src/assets/img/profile_temp.png'
        }

    } else {
        const is_not_logined = document.querySelectorAll('.is_not_logined')

        is_not_logined.forEach(element => {
            element.style.display = 'flex'
        });
    }
}

const logout = (event) => {
    event.preventDefault()
    localStorage.removeItem('user');
    localStorage.removeItem('follow');
    deleteCookie('access')
    deleteCookie('refresh')
    location.href = '/index.html'
}

is_logined()
$logout_btn.addEventListener('click',logout)
