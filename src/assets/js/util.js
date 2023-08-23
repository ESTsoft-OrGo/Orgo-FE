// 이벤트 발생을 지연시키는 함수

/**
 * @param {Function} func 함수 타입 : 실행될 Func
 * @param {int} delay int 타입 : 딜레이 시킬 시간 (밀리세컨드 ms)
 */
export const debouncing = (func, delay) => {
    let timer;
    return (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(event);
        }, delay);
    };
}

/**
 * @param {Function} func 함수 타입 : 실행될 Func
 * @param {int} delay int 타입 : 딜레이 시킬 시간 (밀리세컨드 ms)
 */
export const throttling = (func, delay) => {
    let timer;
    return (event) => {
    // 이미 타이머가 있다면 실행 X , 타이머가 없다면 함수를 실행하고 일정 시간 후 타이머 초기화
        if (timer) {
            return
        };
        timer = setTimeout(() => {
            func(event);
            timer = null;
        }, delay);
    };
};

export const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * @param {string} cookie_name 저장될 쿠키 이름
 * @param {string} value 저장될 value
 */
export const setCookie = (cookie_name, value) => {
    let exdate = new Date();
    exdate.setDate(exdate.getMinutes() + 30);
    // 설정 일수만큼 현재시간에 만료값으로 지정
    const cookie_value = value + '; expires=' + exdate.toUTCString();
    document.cookie = cookie_name + '=' + cookie_value;
}

/**
 * @param {string} cookie_name 가져올 쿠키 이름
 */
export const getCookie = function(name){
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
}


export const setWithExpire = (key, data) => {
    let now = new Date()
    let item = data
    item['expires'] = now.getTime() + (2*60*60*1000) - 1000
    localStorage.setItem(key,JSON.stringify(item))
}

export const getWithExpire = (key) => {
    
    const itemStr = localStorage.getItem(key)

    if(!itemStr){
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if(now.getTime() > item.expires) {
        localStorage.removeItem(key)
        deleteCookie('access')
        deleteCookie('refresh')
        alert('로그인 시간이 만료되어 로그아웃 되었습니다.')
        return null
    }
    return itemStr
}

// 로그인이 되있으면 홈으로
export const is_logined = () => {
    if (localStorage.getItem('user')) {
        location.href= '/index.html'
    }
}

// 디테일 뷰 들어가기
export const detail_page = (event) => {
    let target = event.target

    while (target.classList != 'post_content'){
        target = target.parentNode
    }
    const pages = {
        'pages': target.id
    }
    localStorage.setItem("renderPage", JSON.stringify(pages));
}