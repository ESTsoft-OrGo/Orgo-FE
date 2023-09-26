import { getCookie, detail_page, getWithExpire,setWithExpire} from "./util.js"
import { create_notify } from "./createElement.js"
import { followFunc } from "./follow.js"


const myNotification = async () => {
    const $notify_list = document.querySelector('.notify_list')

    const url = 'https://api.withorgo.site/notify/'
    const access = getCookie('access')

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.notify){

            const $notify_none = document.querySelector('.notify_none')

            const notifications = data.notify
            notifications.forEach(notification => {
                const element = create_notify(notification)
                $notify_list.append(element)
            });

            localStorage.setItem('myNotify', JSON.stringify(notifications));
            const newNotify = JSON.parse(localStorage.getItem('myNotify'))
            const $notify_count = document.querySelector('.notify_count')

            if(newNotify.length > 0) {
                $notify_none.remove()
                $notify_count.style.display = 'flex'
                $notify_count.innerText = newNotify.length
            } else {
                $notify_count.style.display = 'none'
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });

    
}

myNotification()

