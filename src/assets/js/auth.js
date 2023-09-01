import {getWithExpire} from "./util.js"

// 로그인된 유저 인증
const auth_user = () => {
    if (getWithExpire('user')) {
        const logined = true
    } else {
        alert('로그인이 필요한 서비스입니다.')
        location.href = "/src/view/login.html"
    }
}

auth_user()