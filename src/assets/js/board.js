import { getCookie,detail_page } from "./util.js"
import { create_post } from "./createElement.js"

const post_list = async () => {
    const url = 'http://127.0.0.1:8000/post/'

    await fetch(url, {
        method: "POST",
        headers: {},
    })
    .then((res) => res.json())
    .then((data) => {
        const $post_list = document.querySelector('.post_list')
        const $board_side = document.querySelector('.board_side')
        const datas = data.posts
        const recent_posts = data.recent_posts
        
        let n = 0
        
        recent_posts.forEach(post=> {
            n = n + 1
            const side = create_sidepost(post,n)
            side.addEventListener('click', recent_page)
            $board_side.append(side)
        })

        datas.forEach(data => {
            const element = create_post(data.post,data.writer,'board',data.likes)
            $post_list.append(element)
        });

        const articles = document.querySelectorAll('.post_content')

        articles.forEach(article => {
            article.addEventListener('click',detail_page)
        });

        const $follow_btns = document.querySelectorAll('.post_owner_follow > button')

        if (localStorage.getItem('user')) {
            const profile = JSON.parse(localStorage.getItem('user'))
            const follow_list = JSON.parse(localStorage.getItem('follow'))

            $follow_btns.forEach(btn => {

                btn.addEventListener('click',followFunc)

                if (btn.id == profile.id) {
                    btn.remove()
                }
                follow_list.forEach(follow => {
                    if (follow.target_id_id == btn.id) {
                        btn.innerText = 'Unfollow'
                    }
                });
            });

        } else {
            $follow_btns.forEach(btn => {
                btn.remove()
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

// 최근 게시물 뷰 들어가기
const recent_page = (event) => {
    let target = event.target
    const pages = {
        'pages': target.id
    }
    localStorage.setItem("renderPage", JSON.stringify(pages));
}

const create_sidepost = (data,n) => {
    const div = document.createElement('div')
    const p = document.createElement('p')
    const a = document.createElement('a')

    div.className = 'side_post'
    p.innerText = n
    a.href = '/src/view/view.html'
    a.id = data.id
    a.innerText = data.title

    div.append(p,a)

    return div
}

const is_logined = () => {

    if (localStorage.getItem('user')) {
        const profile = JSON.parse(localStorage.getItem('user'))
        const $writer_img = document.querySelector('.post_writer_img > img')
        
        if (profile.profileImage){
            $writer_img.src = 'http://127.0.0.1:8000'+ profile.profileImage
        } else {
            $writer_img.src = '/src/assets/img/profile_temp.png'
        }

    }
}

// 팔로우
export const followFunc = async(event) => {

    const target_id = event.target.id
    const access = getCookie('access')
    const formData = new FormData();

    formData.append('you', target_id);

    const url = 'http://127.0.0.1:8000/user/follow/'

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.message){
            alert(data.message)
            if(data.new_following) {
                localStorage.setItem('follow', JSON.stringify(data.new_following));
            } else {
                localStorage.setItem('follow', JSON.stringify({}));
            }
            // location.reload()
        }
    })
    .catch((err) => {
        console.log(err);
    });
    location.reload()
}

is_logined()
post_list()
