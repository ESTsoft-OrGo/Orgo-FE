import {getWithExpire,deleteCookie} from "./util.js"

const $logout_btn = document.querySelector('.logout_btn')
const $avatarBtn = document.querySelector('.avatar_img_li')

export let notisocket ;

// 로그인이 되있는지 확인
const is_logined = async() => {

    if (getWithExpire('user')) {
        const is_logined = document.querySelectorAll('.is_logined')
        const profile = JSON.parse(getWithExpire('user'))
        const $avatar_img = document.querySelector('.avatar_img')
        
        const notify = JSON.parse(localStorage.getItem('myNotify'))
        const $notify_count = document.querySelector('.notify_count')
        if(notify.length > 0) {
            $notify_count.style.display = 'flex'
            $notify_count.innerText = notify.length
        } else {
            $notify_count.style.display = 'none'
        }

        is_logined.forEach(element => {
            element.style.display = 'flex'
        });
        
        if (profile.profileImage){
            $avatar_img.src = 'http://127.0.0.1:8000'+ profile.profileImage
        } else {
            $avatar_img.src = '/src/assets/img/profile_temp.png'
        }

        notisocket = new WebSocket(`ws://127.0.0.1:8000/notify/${profile.id}`)
        notisocket.onmessage = (e) => {
            const receiveData = JSON.parse(e.data)
            localStorage.setItem('myNotify', JSON.stringify(receiveData.message));
            const newNotify = JSON.parse(localStorage.getItem('myNotify'))
            const $notify_count = document.querySelector('.notify_count')

            if(newNotify.length > 0) {
                $notify_count.style.display = 'flex'
                $notify_count.innerText = newNotify.length
            } else {
                $notify_count.style.display = 'none'
            }
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

const toggleFunc = () => {
    const $toggle_menu = document.querySelector('.toggle_menu')
    $toggle_menu.classList.toggle('hidden')
}

is_logined()
$logout_btn.addEventListener('click',logout)
$avatarBtn.addEventListener('click',toggleFunc)