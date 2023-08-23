import { getCookie, detail_page, getWithExpire,setWithExpire} from "./util.js"
import { create_post,create_follow } from "./createElement.js"
import { followFunc } from "./follow.js"

const $imageInput = document.querySelector('.image-input')
const $userImage = document.querySelector('.user-profile-img');
const $relatedBtn = document.querySelectorAll('.related');
const $user_name = document.querySelector('.user-name')
const $user_about = document.querySelector('.user-about')
const $profileimg = document.querySelector('.user-profile-img')
const $profile_save = document.querySelector('.user-profile-save')

const profile_setting = () => {
    let user = getWithExpire('user');
    const user_profile = JSON.parse(user)
    
    $user_name.value = user_profile.nickname
    $user_about.value = user_profile.about

    if (user_profile.profileImage){
        $profileimg.src = 'http://127.0.0.1:8000'+ user_profile.profileImage
    } else {
        $profileimg.src = '/src/assets/img/profile_temp.png'
    }
}

const mypost_list = async () => {

    const access = getCookie('access')
    const url = 'http://127.0.0.1:8000/user/profile/'

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        const $post_list = document.querySelector('.post_list')
        const $follower_list = document.querySelector('.follower_list')
        const $following_list = document.querySelector('.following_list')
        const $user_posts = document.querySelector('.user-posts')
        const $user_follower = document.querySelector('.user-follower')
        const $user_following = document.querySelector('.user-following')
        const posts = data.my_posts
        const followers = data.follower
        const followings = data.following

        $user_posts.innerText = '게시물 ' + data.my_posts.length
        $user_follower.innerText = '팔로워 ' + data.follower.length
        $user_following.innerText = '팔로잉 ' + data.following.length
        
        posts.forEach(post => {
            const element = create_post(post.post,data.serializer,'profile',post.likes)
            $post_list.append(element)
        });

        const articles = document.querySelectorAll('.post_content')
        const $follow_btns = document.querySelectorAll('.post_owner_follow > button')
        const follow_list = JSON.parse(localStorage.getItem('follow'))

        articles.forEach(article => {
            article.addEventListener('click',detail_page)
        });

        $follow_btns.forEach(btn => {
            btn.remove()
        });

        followers.forEach(follower => {
            const element = create_follow(follower[0])
            $follower_list.append(element)
        });

        followings.forEach(following => {
            const element = create_follow(following[0])
            $following_list.append(element)
        });

        const $follow_cencles = document.querySelectorAll('.follow_cancle > button')
        
        $follow_cencles.forEach(btn => {
            btn.addEventListener('click',followFunc)
            follow_list.forEach(follow => {
                if (follow.target_id_id == btn.id) {
                    btn.innerText = 'Unfollow'
                }
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

const profile_save = async (event) => {
    event.preventDefault()

    const formData = new FormData();

    const nickname = $user_name.value
    const about = $user_about.value
    const access = getCookie('access')
    const profileimage = $imageInput.files[0]

    if (profileimage){
        formData.append('profileImage', profileimage);
    } 

    formData.append('nickname', nickname);
    formData.append('about', about);

    const url = 'http://127.0.0.1:8000/user/profile/update/'

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            alert('프로필 변경이 완료되었습니다.')
            setWithExpire('user', data);
            location.reload()
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const previewImage = (event) => {
    const file = event.target.files[0];

    if (file.size > 250000){
        alert('파일크기는 2.5MB 이내로 가능합니다.')
        event.target.value = ''
    } else{
        let reader = new FileReader();

        reader.onload = function (event) {
            $userImage.setAttribute("src", event.target.result);
        };
        reader.readAsDataURL(file);
    }
    
};

const relatedClick = (e) => {
    e.preventDefault()

    const target = e.target
    const $choice_post = document.querySelector('.choice_post')
    const $choice_follower = document.querySelector('.choice_follower')
    const $choice_following = document.querySelector('.choice_following')

    $choice_post.classList = 'choice_post hidden'
    $choice_follower.classList = 'choice_follower hidden'
    $choice_following.classList = 'choice_following hidden'

    if(target.innerText == '게시물'){
        $choice_post.classList = 'choice_post'
    } else if(target.innerText == '팔로워'){
        $choice_follower.classList = 'choice_follower'
    } else if(target.innerText == '팔로잉'){
        $choice_following.classList = 'choice_following'
    }

    $relatedBtn.forEach(element => {
        element.classList = 'related'
    });

    target.classList = 'related clicked'
}



profile_setting()
mypost_list()

$imageInput.addEventListener("change", previewImage);

$relatedBtn.forEach(element => {
    element.addEventListener('click', relatedClick)
});

$profile_save.addEventListener('click', profile_save)
