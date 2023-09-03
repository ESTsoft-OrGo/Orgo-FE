import { detail_page,getWithExpire,slide_func,study_page } from "./util.js"
import { create_post,create_follow,create_study } from "./createElement.js"
import { followFunc } from "./follow.js"

const $relatedBtn = document.querySelectorAll('.related');

const post_list = async () => {
    const urlInQuery = location.href;
    const urlGetStr = new URL(urlInQuery);
    const urlParams = urlGetStr.searchParams;
    const query = urlParams.get('query');
    const formData = new FormData();
    formData.append('query', query);
    
    const url = 'https://api.withorgo.site/post/search/'

    await fetch(url, {
        method: "POST",
        headers: {},
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        const $post_list = document.querySelector('.post_list')
        const $profile_list = document.querySelector('.profile_list')
        const $study_list = document.querySelector('.study_list')
        const $search_result = document.querySelector('.search-result > p')
        const $post_search = document.querySelector('.post_search')
        const $profile_search = document.querySelector('.profile_search')
        const $study_search = document.querySelector('.study_search')
        const $post_none = document.querySelector('.post_none')
        const $profile_none = document.querySelector('.profile_none')
        const $study_none = document.querySelector('.study_none')
        const posts = data.posts
        const profiles = data.profiles
        const studies = data.studies

        $search_result.innerText = `${query} 검색 결과 ${posts.length + profiles.length + studies.length}건`

        $post_search.innerText = `게시물 ${data.posts.length}건`
        $profile_search.innerText = `프로필 ${data.profiles.length}건`
        $study_search.innerText = `스터디 ${data.studies.length}건`


        if(posts.length > 0){
            $post_none.remove()
            posts.forEach(data => {
                const element = create_post(data.post,data.writer,'search',data.post.likes.length)
                if(data.post.images.length > 0){
                    slide_func(element)
                }
                $post_list.append(element)
            });
        }

        if(profiles.length > 0){
            $profile_none.remove()
            profiles.forEach(profile => {
                const element = create_follow(profile,'search')
                $profile_list.append(element)
            });
        }

        if(studies.length > 0){
            $study_none.remove()
            studies.forEach(element => {
                const study = create_study(element)
                $study_list.append(study)
            });
    
            const $study_div = document.querySelectorAll('.study_div')
    
            $study_div.forEach(element => {
                element.addEventListener('click',study_page)
            });
        }
        

        const articles = document.querySelectorAll('.post_content')

        articles.forEach(article => {
            article.addEventListener('click',detail_page)
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

const relatedClick = (e) => {
    e.preventDefault()

    const target = e.target
    const $choice_post = document.querySelector('.choice_post')
    const $choice_profile = document.querySelector('.choice_profile')
    const $choice_study = document.querySelector('.choice_study')

    $choice_post.classList = 'choice_post hidden'
    $choice_profile.classList = 'choice_profile hidden'
    $choice_study.classList = 'choice_study hidden'

    if(target.innerText.includes('게시물')){
        $choice_post.classList = 'choice_post'
    } else if(target.innerText.includes('프로필')){
        $choice_profile.classList = 'choice_profile'
    } else if(target.innerText.includes('스터디')){
        $choice_study.classList = 'choice_study'
    }

    $relatedBtn.forEach(element => {
        element.classList = 'related'
    });

    target.classList = 'related clicked'
}

post_list()
$relatedBtn.forEach(element => {
    element.addEventListener('click', relatedClick)
});