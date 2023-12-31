import {getWithExpire,deleteCookie, user_page} from "./util.js"

const $logout_btn = document.querySelector('.logout_btn')
const $avatarBtn = document.querySelector('.avatar_img_li')

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
            $avatar_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ profile.profileImage
        } else {
            $avatar_img.src = '/src/assets/img/profile_temp.png'
        }

        let notisocket;

        notisocket = new WebSocket(`wss://api.withorgo.site/notify/${profile.id}`)
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


const user = getWithExpire('user');
const user_profile = JSON.parse(user)

const profileLink = document.querySelector('a[href="/src/view/profile.html"]');

profileLink.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem("userprofile", JSON.stringify({ 'user_profile': user_profile.id}));
    window.location.href = profileLink.href; 
});

is_logined()
$logout_btn.addEventListener('click',logout)
$avatarBtn.addEventListener('click',toggleFunc)