import { getCookie, getWithExpire, profile} from "./util.js"
import { create_follow,create_blackuser } from "./createElement.js"

const $chat_room_list = document.querySelector('.chat-room-list')
const $chat_add_btn = document.querySelector('.chat-list-header button')
const user = JSON.parse(getWithExpire('user'))
const $modal = document.querySelector('.modal')
const $modalClose = document.querySelector('.modal_close')
const $search_input = document.querySelector(".chat-list-search > input");
const $relatedBtn = document.querySelectorAll('.related');

let is_first = false
let socket;

const folloingList = async() => {
    const $following_list = document.querySelector('.following_list')
    const $black_list = document.querySelector('.black_list')
    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/following/'
    const $myName = document.querySelector('.myName')

    $myName.innerText = user.nickname

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        const blacklists = data.blacklist.blacklist.blacklist_profile
        blacklists.forEach(blacklist => {
            const element = create_blackuser(blacklist)
            $black_list.append(element)
        });

        const followings = data.following
        followings.forEach(following => {
            const element = create_follow(following,'Chat')
            $following_list.append(element)
        });

        const $unblockBtns = document.querySelectorAll('.blackuser_btn_div > button')
        const $followChats = document.querySelectorAll('.followChat')

        $unblockBtns.forEach(btn => {
            btn.addEventListener('click',unblackUser)
        });

        $followChats.forEach(btn => {
            btn.addEventListener('click',addChat)
        });
        
        profile()
    })
    .catch((err) => {
        console.log(err);
    });
}

const chatlist = async () => {
    // event.preventDefault()
    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/'

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {

        const rooms = data.rooms

        rooms.forEach(element => {
            const room = create_roomdiv(element)
            const room_target = element.target
            room.addEventListener('click',(event) => chatjoin(event,room_target))
            $chat_room_list.append(room)
        });

        const $room_more_btns = document.querySelectorAll('.room_more_btn')
        const $room_delete_btn = document.querySelectorAll('.room_delete')
        const $black_user_btn = document.querySelectorAll('.black_user')

        $room_more_btns.forEach(btn => {
            btn.addEventListener('click',roomMore)
        });

        $room_delete_btn.forEach(btn => {
            btn.addEventListener('click',removeChat)
        });

        $black_user_btn.forEach(btn => {
            btn.addEventListener('click',blackUser)
        });

        $search_input.addEventListener('input',searchRoom)

    })
    .catch((err) => {
        console.log(err);
    });
}

const create_roomdiv = (element) => {
    const room = document.createElement('a')
    const unread_ms_count = document.createElement('div')
    const room_img_div = document.createElement('div')
    const room_img = document.createElement('img')
    const room_info = document.createElement('div')
    const room_info_p = document.createElement('p')
    const room_info_p2 = document.createElement('p')
    const room_more = document.createElement('div')
    const room_more_btn = document.createElement('button')
    const room_more_btn_i = document.createElement('i')
    const room_menu = document.createElement('div')
    const room_delete = document.createElement('button')
    const black_user = document.createElement('button')
    
    unread_ms_count.className = 'ms_count'
    unread_ms_count.innerText = element.unread_message

    room.className = 'room_div'
    room.id = element.room.title
    room_img_div.className = 'room_img'

    if(element.room.title.includes('study')) {
        room_img.src = '/src/assets/img/study.png'
    } else {
        if(element.target.profileImage){
            room_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ element.target.profileImage
        } else {
            room_img.src = '/src/assets/img/profile_temp.png'
        }
    }

    room_info.className = 'room_info'
    room_info_p.className = 'room_info_nickname'
    if(element.room.title.includes('study')) {
        room_info_p.innerText = element.target.title
    } else {
        room_info_p.innerText = element.target.nickname
    }
    room_info_p2.innerText = element.recent.content

    room_img_div.append(room_img)
    room_info.append(room_info_p,room_info_p2)
    
    room_more_btn_i.classList = 'fa-solid fa-ellipsis'
    room_more_btn.classList = 'room_more_btn'
    room_more_btn.append(room_more_btn_i)
    room_delete.innerText = '채팅방 삭제'
    room_delete.classList = 'room_delete'
    room_delete.id = element.room.id
    black_user.innerText = '채팅 차단'
    black_user.classList = 'black_user'
    black_user.id = element.room.id
    room_menu.classList = 'room_menu hidden'
    room_menu.append(room_delete,black_user)
    room_more.classList = 'room_more'
    room_more.append(room_more_btn,room_menu)

    if (element.unread_message > 0){
        room.append(unread_ms_count,room_img_div,room_info,room_more)
    } else {
        room.append(room_img_div,room_info,room_more)
    }

    return room
}

const addChat = async (event) => {
    event.preventDefault()

    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/join/'
    const chatTarget = event.target.id
    const formData = new FormData();

    formData.append('target', chatTarget);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        alert(data.message)
        location.reload()
    })
    .catch((err) => {
        console.log(err);
    });
}

const removeChat = async (event) => {
    event.preventDefault()

    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/delete/'
    const chatTarget = event.target.id
    const formData = new FormData();

    formData.append('target', chatTarget);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        alert(data.message)
        location.reload()
    })
    .catch((err) => {
        console.log(err);
    });
}

const blackUser = async (event) => {
    event.preventDefault()

    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/blacklist/add/'
    const chatTarget = event.target.id
    const formData = new FormData();

    formData.append('target', chatTarget);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        alert(data.message)
        location.reload()
    })
    .catch((err) => {
        console.log(err);
    });
}

const unblackUser = async (event) => {
    event.preventDefault()

    const access = getCookie('access')
    const url = 'http://127.0.0.1:10250/chat/blacklist/del/'
    const chatTarget = event.target.id
    const formData = new FormData();

    formData.append('target', chatTarget);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        alert(data.message)
        location.reload()
    })
    .catch((err) => {
        console.log(err);
    });
}

const roomMore = async (event) => {
    event.preventDefault()
    
    let target = event.target

    while (target.classList != 'room_more'){
        target = target.parentNode
    }

    const $room_menu = target.querySelector('.room_menu')
    $room_menu.classList.toggle('hidden')
}

const chatViewSet = () => {

    if(!is_first){
        const $chatRoom = document.querySelector('.chat-room')
        const $chatWait = document.querySelector('.chat-wait')
        $chatRoom.classList = 'chat-room'
        $chatWait.classList = 'hidden'
        is_first = true
    }

    return false
}

const chatjoin = (event,room_target) => {

    event.preventDefault()
    let target = event.target

    while (target.classList != 'room_div'){
        target = target.parentNode
    }
    const $ms_count = target.querySelector('.ms_count')
    if($ms_count){
        $ms_count.remove()
    }
    const $chatTitleImg = document.querySelector('.chat-room-header > img')
    const $chatTitle = document.querySelector('.chat-room-header > p')
    const $chatMessageList = document.querySelector('.chat-message-list')
    chatViewSet()
    $chatMessageList.innerHTML = ''

    if(room_target.profileImage){
        $chatTitleImg.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ room_target.profileImage
    } else {
        $chatTitleImg.src = '/src/assets/img/profile_temp.png'
    }

    $chatTitle.innerText = room_target.nickname

    const chatlist = document.querySelector(".chat-room-list");
    const rooms = chatlist.querySelectorAll(".room_div");

    rooms.forEach(room => {
        const $classList = room.classList.value
        if($classList.includes('joined')){
            socket.close()
            room.classList = 'room_div'
        }
    });

    let is_action = false;
    target.classList.add('joined')
    const title = target.id.toString()
    socket = new WebSocket(`ws://127.0.0.1:10250/chat/${title}`)

    socket.onopen = function (e) {
        socket.send(JSON.stringify({
            'method': 'join',
            'message': 'join'
        }))
    }

    socket.onmessage = (e) => {
        const receiveData = JSON.parse(e.data)
        if(receiveData.status == 'join'){
            if (is_action){
                return false;
            } else {
                const datas = receiveData.message
                // JavaScript 예시 코드
                for (const day in datas) {
                    if (datas.hasOwnProperty(day)) {
                        const messages = datas[day];
                        joinPrintMessage(day,messages);
                    }
                }
                is_action = true;
            }
        } else {
            const datas = receiveData.message
            datas.forEach(element => {
                printMessage(element)
            });
        }
        const $element = document.querySelector('.chat-message-list')
        $element.scrollTop = $element.scrollHeight;
    }

    const $message_submit = document.querySelector('.message-input-box button')
    const $ms = document.querySelector('.message-input')

    const msSend = () => {
        if($ms.value){
            socket.send(JSON.stringify({
                'method': 'message',
                'message': $ms.value,
                'writer': user.id
            }))
        }
        $ms.value = '';
    }

    // 엔터를 눌러도 click 이벤트가 발생하게 처리
    $ms.onkeyup = function (e) {
        if (e.keyCode === 13) {  // enter, return
            $message_submit.click();
        }
    };

    $message_submit.addEventListener('click',msSend)
}

const joinPrintMessage = (day,messages) => {
    const $message_section = document.querySelector('.chat-message-list')
    const ms_days = document.createElement('div')
    const ms_day = document.createElement('div')

    const time = new Date(day)
    const year = time.getFullYear();
    const month = time.getMonth() +1;
    const date = time.getDate();

    ms_days.classList = 'message-days'
    ms_day.classList = 'message-day'
    ms_day.innerText = `${year}년 ${month}월 ${date}일`
    ms_days.append(ms_day)

    $message_section.append(ms_days)

    messages.forEach(data => {
        const writer = data.writer
        const login_user = user.id
        if (writer == login_user) {
            const ms = sendMessage(data)
            $message_section.append(ms)
        } else {
            const ms = getMssage(data)
            $message_section.append(ms)
        }
    });
    
}

const printMessage = (data) => {
    const $message_section = document.querySelector('.chat-message-list')

    const writer = data.writer
    const login_user = user.id

    if (writer == login_user) {
        const ms = sendMessage(data)
        $message_section.append(ms)
    } else {
        const ms = getMssage(data)
        $message_section.append(ms)
    }
}

const sendMessage = (data) => {
    const div = document.createElement('div')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    
    p1.innerText = data.content
    p1.className = 'message-bubble'

    p2.innerText = timeRead(data.created_at)
    p2.className = 'message-time'

    div.className = 'send-message'
    div.append(p1,p2)

    return div
}

const getMssage = (data) => {
    const div = document.createElement('div')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    
    p1.innerText = data.content
    p1.className = 'message-bubble'
    p2.innerText = timeRead(data.created_at)
    p2.className = 'message-time'
    
    div.className = 'get-message'
    div.append(p1,p2)

    return div
}

const timeRead = (data) => {
    const time = new Date(data)
    const hours = time.getHours();
    const minutes = time.getMinutes();
    // ${year}년 ${month}월 ${date}일 
    return `${hours}시 ${minutes}분 `
}

const modalOpenBtn = () => {
    $modal.classList.toggle('hidden')
}

const modalCloseBtn = () => {
    $modal.classList.toggle('hidden')
}

const searchRoom = () => {

    let filter = $search_input.value.toUpperCase();
    const chatlist = document.querySelector(".chat-room-list");
    const rooms = chatlist.querySelectorAll(".room_div");

    if(filter){
        rooms.forEach(element => {
            element.classList.add("hidden");
            const name = element.querySelector(".room_info_nickname");
            if (name.innerText.toUpperCase().includes(filter)) {
                element.classList.remove("hidden");
            } 
        });
    } else {
        rooms.forEach(element => {
            element.classList.remove("hidden");
        });
    }
    
}

const relatedClick = (e) => {
    e.preventDefault()

    const target = e.target
    const $following_list = document.querySelector('.following_list')
    const $black_list = document.querySelector('.black_list')

    $following_list.classList = 'following_list hidden'
    $black_list.classList = 'black_list hidden'

    if(target.innerText == '팔로잉'){
        $following_list.classList = 'following_list'
    } else {
        $black_list.classList = 'black_list'
    } 

    $relatedBtn.forEach(element => {
        element.classList = 'related'
    });

    target.classList = 'related clicked'
}


folloingList()
chatlist()
$chat_add_btn.addEventListener('click',modalOpenBtn)
$modalClose.addEventListener('click',modalCloseBtn)
$relatedBtn.forEach(element => {
    element.addEventListener('click', relatedClick)
});