export const create_post = (post,owner,where,likes) => {
    const post_div = document.createElement('div');
    const post_owner = document.createElement('div');
    const post_owner_div = document.createElement('div');
    const post_owner_img = document.createElement('img');
    const post_owner_info = document.createElement('div');
    const post_owner_info_p1 = document.createElement('p');
    const post_owner_info_p2 = document.createElement('p');
    const post_owner_follow = document.createElement('div');
    const post_owner_follow_btn = document.createElement('button');
    const post_content = document.createElement('a');
    const post_title = document.createElement('p');
    const post_contents = document.createElement('p');
    const post_img_div = document.createElement('div');
    const post_img = document.createElement('img');
    const post_createdat_div = document.createElement('div');
    const post_createdat = document.createElement('p');
    const post_reaction_info = document.createElement('div');
    const reaction_info_div1 = document.createElement('div');
    const reaction_info_div1_p1 = document.createElement('p');
    const reaction_info_div1_p2 = document.createElement('p');
    const reaction_info_div2 = document.createElement('div');
    const reaction_info_div2_p1 = document.createElement('p');
    const reaction_info_div2_p2 = document.createElement('p');

    post_div.className = 'post'
    post_owner.className = 'post_owner';
    post_owner_div.className = 'post_owner_img'
    if (owner.profileImage){
        let profile_url;
        if (where == "board") {
            profile_url = 'http://127.0.0.1:8000/media/'
        }
        else if(where == "profile"){
            profile_url = 'http://127.0.0.1:8000'
        }
        else if(where == "search"){
            profile_url = 'http://127.0.0.1:8000'
        }
        post_owner_img.src = profile_url + owner.profileImage
    } else {
        post_owner_img.src = '/src/assets/img/profile_temp.png'
    }
    post_owner_info.className = 'post_owner_info'
    post_owner_info_p1.innerText = owner.nickname
    post_owner_info_p2.innerText = owner.about

    post_owner_follow.className = 'follow_btn_div'
    if(where == "search"){
        post_owner_follow_btn.id = owner.id
    } else {
        post_owner_follow_btn.id = owner.user_id
    }
    post_owner_follow_btn.innerText = 'Follow'

    post_owner.append(post_owner_div,post_owner_info,post_owner_follow)
    post_owner_div.append(post_owner_img)
    post_owner_info.append(post_owner_info_p1,post_owner_info_p2)
    post_owner_follow.append(post_owner_follow_btn)

    post_content.className = 'post_content'
    post_content.id = post.id
    post_content.href = '/src/view/view.html'
    post_title.className = 'post_title'
    post_title.innerText = post.title
    post_contents.innerText = post.content

    post_content.append(post_title,post_contents,post_img_div)

    let media_url

    if(post.postImage){
        if(where == "search"){
            media_url = 'http://127.0.0.1:8000'
        } else{
            media_url = 'http://127.0.0.1:8000/media/';
        }
        post_img.src = media_url + post.postImage
    }
    post_img_div.append(post_img)
    post_img_div.className = 'post_img'

    post_createdat_div.className = 'post_createdat'
    
    const time = new Date(post.created_at)
    const year = time.getFullYear();
    const month = time.getMonth() +1;
    const date = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    
    post_createdat.innerText = `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분 `
    post_createdat_div.append(post_createdat)

    post_reaction_info.className = 'post_reaction_info'
    reaction_info_div1.className = 'reaction_info_div'
    reaction_info_div1_p1.innerText = '좋아요'
    reaction_info_div1_p2.className = 'like_count'
    reaction_info_div1_p2.innerText = likes
    reaction_info_div2.className = 'reaction_info_div'
    reaction_info_div2_p1.innerText = '조회'
    reaction_info_div2_p2.className = 'view_count'
    reaction_info_div2_p2.innerText = post.views
    reaction_info_div1.append(reaction_info_div1_p1,reaction_info_div1_p2)
    reaction_info_div2.append(reaction_info_div2_p1,reaction_info_div2_p2)
    post_reaction_info.append(reaction_info_div1,reaction_info_div2)

    post_div.append(post_owner,post_content,post_createdat_div,post_reaction_info);

    return post_div
}

export const create_follow = (data,type) => {
    const follow = document.createElement('div')
    const follow_img_div = document.createElement('div')
    const follow_img = document.createElement('img')
    const follow_info = document.createElement('div')
    const follow_info_p1 = document.createElement('p')
    const follow_info_p2 = document.createElement('p')
    const follow_btn_div = document.createElement('div')
    const follow_btn = document.createElement('button')

    follow.className = 'follow'
    follow_img_div.className = 'follow_img'

    if (data.profileImage){
        if(type == 'search'){
            follow_img.src = 'http://127.0.0.1:8000'+ data.profileImage
        } else {
            follow_img.src = 'http://127.0.0.1:8000/media/'+ data.profileImage
        }
    } else {
        follow_img.src = '/src/assets/img/profile_temp.png'
    }
    
    follow_img_div.append(follow_img)

    follow_info.className = 'follow_info'
    follow_info_p1.innerText = data.nickname
    follow_info_p2.innerText = data.about
    follow_info.append(follow_info_p1,follow_info_p2)

    if (type == 'Chat'){
        follow_btn_div.className = 'followChat'
        follow_btn.innerText = type
    } else {
        follow_btn_div.className = 'follow_btn_div'
        follow_btn.innerText = 'Follow'
    }

    if(type == 'search'){
        follow_btn.id = data.id
    } else {
        follow_btn.id = data.user_id
    }
    
    follow_btn_div.append(follow_btn)

    follow.append(follow_img_div,follow_info,follow_btn_div)

    return follow
}

export const create_notify = (data) => {
    const notify = document.createElement('div')
    const sender_img_div = document.createElement('div')
    const sender_img = document.createElement('img')
    const sender_info = document.createElement('div')
    const sender_info_p = document.createElement('p')
    const accept_div = document.createElement('div')
    const accept_btn = document.createElement('button')

    notify.className = 'notify'
    sender_img_div.className = 'sender_img'

    if (data.sender.profileImage){
        sender_img.src = 'http://127.0.0.1:8000'+ data.sender.profileImage
    } else {
        sender_img.src = '/src/assets/img/profile_temp.png'
    }
    
    sender_img_div.append(sender_img)

    sender_info.className = 'sender_info'
    sender_info_p.innerText = `${data.sender.nickname}님이 ${data.notify.content}`
    sender_info.append(sender_info_p)
    
    accept_div.className = 'accept_div'
    accept_btn.innerText = '읽음'
    accept_btn.id = data.notify.id

    
    accept_div.append(accept_btn)

    notify.append(sender_img_div,sender_info,accept_div)

    return notify
}