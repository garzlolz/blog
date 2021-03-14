function gett(){
    var name = document.getElementById('name').value;
    if(name == 0){return};
    document.getElementById('change').textContent = name + '，你好!';
}
var blogPost = document.querySelector('.posted');
var RecentPost = document.querySelector('.list-unstyled');
var bigDisplay_titl = document.querySelector('.display-4');
var bigDisplay_date = document.querySelector('.my-3');
var bigDisplay_more = document.querySelector('.mb-0');


var data=[
    {
        date:'3月14號 ,2021  ,  ',
        title:'找工作',
        content:'終於畢業了，現在正在尋找各種前端的工作機會，也順便把部落格的方式改成用陣列輸出，打工這邊也決定在26號結束了，希望接下來可以找到自己喜歡的工作...'
    },
    {
        date:'3月6號 ,2021  ,  ',
        title:'關於localStorage',
        content:"今天複習js，在練習todoList 的 localStorage，setitem，以及getitem的方式;<br>搭配陣列的 push.data 和 splice.data 紀錄一下<br><br>從localstorage上抓下來的話，要將array轉成String<br> JSON.parse(localStorage.getItem('listdata',Data)) <br><br>上傳則要將Array轉為String所以則是<br> <br>JSON.stringify(localStorage.setItem('listData',Data)); <br> 陣列可以分別用 push.data 和 splice.data的方式，將資料push到陣列或刪除。",
    },
    {
        date:'3月5號 ,2021 , ',
        title:'專題結束',
        content:'3月5號這天是我專題評審的日子，在中午和老師面談後，我在兩點的時候進行專題評審;我認為完成度很高了，有硬體、有資料庫(MySQL/Apach server)、也有網頁(html5/css3/javascript/jQuery/Boostrap)，再搭配PHP，我認為以我自己一個人做專題其實已經可以抬頭挺胸的跟老師們報告了，不過上台的時候還是有點緊張，真的是嚇死我哈哈哈哈，接下來就是找工作，在7月就可以拿到畢業證書了'
    },
    {
        date:'2月23號 ,2021 , ',
        title:'109 第二學期',
        content:'這個專題老師是從業界過來的，但很明顯他的名聲一點都不好，學弟也非常討厭他；第二學期開始了，找老師meeting卻被以讀，從上學期11月就跟我說準備告報、準備PTT，東西都準備好了；但老師卻不理我，真看不懂到底在幹嘛...，明天是這學期第一次meeting，住我一帆風順...'
    },
    {
        date:'2月2號 ,2021 , ',
        title:'微創動刀',
        content:'今天是開完刀兩天後，動完刀只能說現在醫療器材真的進步很多，仔細看傷口小到一個爆炸，甚至還有一個什麼凝膠的可以不用縫合傷口，真的厲害。<br><br>不過修復期也要1到兩個月，光是這兩天我光睡覺都被痛醒，真的是沒吃止痛藥睡不著，痛到爆阿哈哈哈，回想起當天開刀的心情，真的是講真到爆炸，先拿一根針從我脊椎旁邊戳一個洞進去，我靠!真的是我打麻醉還痛到哭出來，真的非常痛，後來痛到沒意識，在麻醉復甦室休息了3個小時才出來，真的很痛啊哈哈哈。'
    },
    {
        date:'1月29號 ,2021 , ',
        title:'開刀',
        content:'今天是人生第一次開刀，雖然說是開刀，但其實也不過是微創手術，但不知道為什麼就是怕怕的，想到不是全身麻醉而是只有局部，一開始還沒這個感覺，不過到了要住院還是快尿出來了= =<br><br>不管怎麼說，我只能說人生遇到什麼就要去面對，不要想太多垃圾話，做就對了，醫生告知我要開刀我二話不說就要做，不管結果怎麼樣，2021祝大家都新年快樂'
    },
    {
        date:'1月 15號, 2021 , ',
        title:'想當初那個胎死腹中的專題',
        content:'大三的時候, 當時做了一個APP 叫做抽爆的APP<br>'+
        '先不管當時做得怎麼樣 <strong>抽爆</strong> 是我當初和同學一起合作做出來的APP<br><br>總之 <em>抽爆</em> 是利用爬蟲的方式將所有抽獎的機會匯集成一個資料庫table裡面包含了源網址、獎品、以及官方要求的抽獎方法<br><br>這個APP我們最終是使用了安卓studio做了出來，但是畫面很陽春，現在想想真的是醜到一個爆炸，甚至沒有流失體的把它刪掉了<br><br>總之最後這個APP老師是不採用了，我有點絕望，畢竟花了1年的時間從無到有生出來一個APP也不是什麼簡單事情；反正身為學生的我有點自暴自棄，甚至身上大4也不想做任何事情'
    },
    {
        date:'11月3號, 2020 , ',
        title:'IOT空氣盒子',
        content:'不知不覺竟然要延畢真的是差點笑死,雖然自己本來就知道自己因為專題要延畢，不過面對事實還真的是無能為力，總而言之是想到了一個題目<strong>空氣盒子</strong> 就是一個用兩顆sensor和Arduino做硬體，然後使用網頁當UI的一個project<br><br>'+
        '最初<em>空氣盒子</em>這個東西我原本覺得應該花個1個月自己應該就可以做完.<br><br>'+
        '不過最後我發現電路雖然接好了不過電路卻不會動拿了三用電表才發現VCC跟GND的腳位我搞錯了，重新裝上新的sensor然後再和上電路卻又發現電路還是死的!原來另位一顆sensor也被我燒掉了。沒想到上大學還要一直跑電子街，傻爆眼:('
    }
]

var list = '';
var str = '';
for(var i=0;i<data.length;i++){
   
    str+=
    '<article class="blog-post"><h2 class="blog-post-title" id="post'+i+'">'+data[i].title+'</h2>'+
    '<p class="blog-post-meta">'+data[i].date+'<a href="https://www.instagram.com/garz.1333/">施宏勳</a></p>'+
    '<p>'+data[i].content+'</p>'+
    '</article>';
    list+='<li><a href="#post'+i+'">'+data[i].title+'</li>';

    RecentPost.innerHTML = list;
    blogPost.innerHTML = str;
};

bigDisplay_titl.innerHTML = data[0].title;
bigDisplay_date.innerHTML = data[0].date+'.......';
bigDisplay_more.innerHTML = '<a href="#post0" class="text-white fw-bold">更多...</a>'

/**<article class="blog-post">
<h2 class="blog-post-title" id="twenty1_3_5">專題結束</h2>
<p class="blog-post-meta">3月5號 ,2021<a href="https://www.instagram.com/garz.1333/">施宏勳</a></p>

<p>3月5號這天是我專題評審的日子，在中午和老師面談後，我在兩點的時候進行專題評審</p>
<p>我認為完成度很高了，有硬體、有資料庫(MySQL/Apach server)、也有網頁(html5/css3/javascript/jQuery/Boostrap)，再搭配PHP，我認為以我自己一個人做專題其實已經可以抬頭挺胸的跟老師們報告了，不過上台的時候還是有點緊張，真的是嚇死我哈哈哈哈，接下來就是找工作，在7月就可以拿到畢業證書了</p>
</article>**/