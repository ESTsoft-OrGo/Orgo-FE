import { detail_page,getWithExpire,slide_func,user_page } from "./util.js"
import { create_post } from "./createElement.js"
import { followFunc } from "./follow.js"



const post_list = async () => {
    const url = 'https://api.withorgo.site/post/'

    await fetch(url, {
        method: "POST",
        headers: {},
    })
    .then((res) => res.json())
    .then((data) => {
        const $post_list = document.querySelector('.post_list')
        const datas = data.posts

        datas.forEach(data => {
            const element = create_post(data.post,data.writer,'board',data.likes)
            if(data.post.images.length > 0){
                slide_func(element)
            }
            $post_list.append(element)
        });

        const articles = document.querySelectorAll('.post_content')

        articles.forEach(article => {
            article.addEventListener('click',detail_page)
        });

        const userarticles = document.querySelectorAll('.userprofile')

        userarticles.forEach(userarticles => {
            userarticles.addEventListener('click',user_page)
        });

        const $follow_btns = document.querySelectorAll('.follow_btn_div > button')

        if (getWithExpire('user')) {
            const profile = JSON.parse(getWithExpire('user'))
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

const api_recent = async() => {
    const url = 'https://api.withorgo.site/post/recommended/'

    await fetch(url, {
        method: "POST",
        headers: {},
    })
    .then((res) => res.json())
    .then((data) => {
        const $board_side = document.querySelector('.board_side')
        const recommended_posts = data.recommended_posts
        
        let n = 0
        
        recommended_posts.forEach(post=> {
            n = n + 1
            const side = create_sidepost(post,n)
            side.addEventListener('click', recommended_page)
            $board_side.append(side)
        })
    })
    .catch((err) => {
        console.log(err);
    });
}

// 추천 게시물 뷰 들어가기
const recommended_page = (event) => {
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

    if (getWithExpire('user')) {
        const profile = JSON.parse(getWithExpire('user'))
        const $writer_img = document.querySelector('.post_writer_img > img')
        
        if (profile.profileImage){
            $writer_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ profile.profileImage
        } else {
            $writer_img.src = '/src/assets/img/profile_temp.png'
        }

    }
}

is_logined()
post_list()
api_recent()
