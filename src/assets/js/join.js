import {getWithExpire} from './util.js'

const $join_btn= document.querySelector('.join_btn')
const $otp_btn = document.querySelector('.user-join__otp_generate')
const $user_join__otp = document.querySelector('.user-join__otp')
let stored_otp ;

const otpFunc = async () => {
    const url = 'http://127.0.0.1:8000/user/otp/'
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
            alert('이메일 확인해주세요.')
            stored_otp = data.otp
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const checkOtp = (e) => {
    const target = e.target
    const val = target.value
    if (stored_otp == val) {
        console.log("인증")
        $join_btn.disabled = false
    } else {
        $join_btn.disabled = true
    }
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

    const url = 'http://127.0.0.1:8000/user/join/'

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
$user_join__otp.addEventListener('input',checkOtp)