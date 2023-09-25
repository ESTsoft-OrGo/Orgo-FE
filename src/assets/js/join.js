import {getWithExpire} from './util.js'

const $join_btn= document.querySelector('.join_btn')
const $otp_btn = document.querySelector('.user-join__otp_generate')
let stored_otp = null

const otpFunc = async () => {
    const url = 'http://api.withorgo.site/user/otp/'
    const email = document.querySelector('.user-join__email').value

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
    }).then((res) => res.json())
    .then((data) => {
        if (data.errors){
            alert(data.errors[0])
        } else{
            console.log(data.otp)
            stored_otp = data.otp
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const joinFunc = async (event) => {
    event.preventDefault()
    
    const email = document.querySelector('.user-join__email').value
    const otp = document.querySelector('.user-join__otp').value
    const password = document.querySelector('.user-join__password').value
    const password_valid = document.querySelector('.user-join__password_valid').value
    
    if (otp != stored_otp){
        alert("인증번호가 일치하지 않습니다.")
        return false
    }

    if ( password != password_valid){
        alert("비밀번호가 다릅니다.")
        return false
    }

    if (password.length < 8){
        alert("비밀번호가 너무 짧습니다. 최소 8자 이상")
        return false
    }

    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

<<<<<<< HEAD
    const url = 'http://api.withorgo.site/user/join/'
=======
    const url = 'http://43.200.64.24/user/join/'
>>>>>>> parent of 3e66587 (feat : 백엔드 HTTPS 설정 완료로 인한 URL 변경)

    await fetch(url, {
        method: "POST",
        headers: {},
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.errors){
            alert(data.errors[0])
        } else{
            alert('회원가입을 축하합니다.')
            location.href= '/src/view/login.html'
        }
    })
    .catch((err) => {
        console.log(err);
    });
}
$join_btn.addEventListener('click',joinFunc)
// 로그인이 되있으면 홈으로
const is_logined = () => {

    if (getWithExpire('user')) {
        location.href = '/index.html'
    }
}

is_logined()

$join_btn.addEventListener('click',joinFunc)
$otp_btn.addEventListener('click',otpFunc)