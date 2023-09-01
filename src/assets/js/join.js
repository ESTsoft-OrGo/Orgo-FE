import {getWithExpire} from './util.js'

const $join_btn= document.querySelector('.join_btn')

const joinFunc = async (event) => {
    event.preventDefault()
    
    const email = document.querySelector('.user-join__email').value
    const password = document.querySelector('.user-join__password').value
    const password_valid = document.querySelector('.user-join__password_valid').value
    
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

    const url = 'http://43.200.64.24/user/join/'

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