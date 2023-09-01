import {getCookie, deleteCookie,getWithExpire} from "./util.js"

const $withdraw_btn = document.querySelector('.withdraw > button')
const user = getWithExpire('user');
const profile = JSON.parse(user)

const account_setting = () => {
    const $user_join_email = document.querySelector('.user_join_info p:first-child')
    const $user_join_method = document.querySelector('.user_join_info p:last-child')
    const $user_account_email = document.querySelector('.user_email p:last-child')
    const $user_account_nickname = document.querySelector('.user_nickname p:last-child')
    const $user_password = document.querySelector('.user_password > a')

    $user_join_email.innerText = profile.email
    $user_join_method.innerText = `${profile.login_method} 가입`
    $user_account_email.innerText = profile.email
    $user_account_nickname.innerText = profile.nickname
    if(profile.login_method != 'email'){
        $user_password.href = ''
    }
}

const user_withdraw = async (event) => {
    event.preventDefault()
    if (!confirm("정말 회원 탈퇴를 하시겠습니까?")) {
        return false
    } else {
        const access = getCookie('access')
        const url = 'http://127.0.0.1:8000/user/profile/delete/'

        await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${access}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data){
                alert(data.message)
                localStorage.removeItem('user');
                localStorage.removeItem('follow');
                deleteCookie('access')
                deleteCookie('refresh')
                location.href = '/index.html'
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
}

account_setting()
$withdraw_btn.addEventListener('click',user_withdraw)