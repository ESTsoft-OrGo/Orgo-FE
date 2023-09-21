import { getCookie, detail_page,setWithExpire,slide_func} from "./util.js"
import { create_post,create_follow } from "./createElement.js"
import { followFunc } from "./follow.js"

const $imageInput = document.querySelector('.image-input')
const $userImage = document.querySelector('.user-profile-img');
const $relatedBtn = document.querySelectorAll('.related');
const $user_name = document.querySelector('.user-name')
const $user_about = document.querySelector('.user-about')
const $profileimg = document.querySelector('.user-profile-img')
const $profile_save = document.querySelector('.user-profile-save')

const userProfileData = JSON.parse(localStorage.getItem('userprofile'));

const mypost_list = async () => {
    
    const access = getCookie('access')
    const url = 'http://127.0.0.1:8000/user/profile/'
    
    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfileData),
    })
    .then((res) => res.json())
    .then((data) => {
        $user_name.value = data.serializer.nickname
        $user_about.value = data.serializer.about

        if (data.user.profileImage){
            $profileimg.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.user.profileImage
        } else {
            $profileimg.src = '/src/assets/img/profile_temp.png'
        }
        if (Number(userProfileData.user_profile) !== data.user_id){
            const $save_btn = document.querySelector('.user-profile-save')
            const $profile_image = document.querySelector('.post-image-div')
            const $user_name = document.querySelector('.user-name')
            const $user_about = document.querySelector('.user-about')
            $save_btn.remove();
            $profile_image.remove();
            $user_name.disabled = true;
            $user_about.disabled = true;
        }
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

        if(posts.length > 0){
            const $post_none = document.querySelector('.post_none')
            $post_none.remove()
            posts.forEach(post => {
                const element = create_post(post.post,data.user,'profile',post.likes)
                if(post.post.images.length > 0){
                    slide_func(element)
                }
                $post_list.append(element)
            });
        }

        const articles = document.querySelectorAll('.post_content')
        const $follow_btns = document.querySelectorAll('.follow_btn_div > button')
        const follow_list = JSON.parse(localStorage.getItem('follow'))

        articles.forEach(article => {
            article.addEventListener('click',detail_page)
        });

        $follow_btns.forEach(btn => {
            btn.remove()
        });

        if(followers.length > 0){
            const $follower_none = document.querySelector('.follower_none')
            $follower_none.remove()
            followers.forEach(follower => {
                const element = create_follow(follower)
                $follower_list.append(element)
            });
        }

        if(followings.length > 0){
            const $following_none = document.querySelector('.following_none')
            $following_none.remove()
            followings.forEach(following => {
                const element = create_follow(following,'Follow')
                $following_list.append(element)
            });
        }

        const $follow_btn_divs = document.querySelectorAll('.follow_btn_div > button')
        
        $follow_btn_divs.forEach(btn => {
            btn.addEventListener('click',followFunc)
            follow_list.forEach(follow => {
                if (follow.target_id_id == btn.id) {
                    btn.innerText = 'Unfollow'
                }
            });
        });
        profile();
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
    formData.append('is_active', true);

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

function profile() {
    const profileLinks = document.querySelectorAll('.userprofile');

    profileLinks.forEach(profileLink => {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            const pages = {
                'user_profile': event.target.id
            };
            localStorage.setItem("userprofile", JSON.stringify(pages));
            location.href = 'profile.html'
        });
    });
}
document.addEventListener('DOMContentLoaded', profile);

mypost_list()
$imageInput.addEventListener("change", previewImage);

$relatedBtn.forEach(element => {
    element.addEventListener('click', relatedClick)
});

$profile_save.addEventListener('click', profile_save)
