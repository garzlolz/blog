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
        date:'4月29號 ,2021 , ',
        title:'處理 JS ARRAY TO CSV 中的 COMMA',
        content:`
        
            &nbsp;&nbsp;今天在上班中遇到了一個小小小問題，首先是在google sheet當中把所有的直轉為陣列
            再將陣列轉為ＣＳＶ格式，但是問題來了，某一串字串裡面有一個COMMA，所以我在stackflow上找了一堆相似的問題
            ，但不得其解;<br><br>最後菜菜的我只好向主管請求幫助，他馬上就幫我找到錯誤的地方，真的是非常慚愧。
            藉此機會紀錄一下<br><br>
            <pre>
            //定義一個空値，以及googlesheet的陣列値
            var csv = '';
            var v = 估狗sheet的値;</pre>
            //分別將每一個値賦予分號
            <pre>for(var row=0;row< v.length;row++){</pre>
                <pre>for(var col = 0; col<v[row].length;col++){</pre>
                    <pre>    if(v[row][col].toString().indexOf(",")!=-1){</pre>
               <pre>         <pre>    v[row][col] = '"'+ v[row][col] + '"';</pre>
               <pre>   };</pre>
               <pre>  };</pre>
               <pre> }</pre>
            <pre>
            //為字串賦予ＣＳＶ格式並儲存至變數中
            v.forEach(function(e) {
                csv += e.join(',')+'/n';
            })</pre>
            <pre>
            //帶入參數回傳CSV檔供下載
            if(page == 1){
                return ContentService.createTextOutput(csv).downloadAsFile("檔案名稱.csv").setMimeType(ContentService.MimeType.CSV);
            }
            else{
              return ContentService.createTextOutput(
               ' Parameter Error.'
              )
            }</pre>

            總之非常感謝主管救我ＱＱ   
        `
    },
    {
        date:'4月13號 ,2021 , ',
        title:'Google APP Script 新嘗試',
        content:`
             &nbsp;&nbsp;在公司擔任 IT 好像就是免不了被當工具人使用吧 Q_Q<br><br>
        主管上禮拜跟我說他們的資料主要是以 google sheet 做訂單管理,<br><br>
        希望我這個資工系出身的也要會GAS,這禮拜被牆破惡補excel函數以及GS...<br><br>
        今天下午就幫公司寫了個從excel note裡導出函數再導入到別的資料表執行,<br><br><br>
        記錄一下新學習到的能力...<br>
            取得檔案中的備註<br>
                FileNote('工作表',將上傳的column,將被取代的column)<br><br>
            定義範圍<br>
                sheet.getRange(col,row);<br><br>
            取得範圍內的值<br>
                range.getValues();<br><br>
            清除欄位內容<br>
                range.clearContent()<br><br>
            <h3>開啟google sheet按鈕的方法 <em>注意 function名稱為google定義</em></h3>
            <p>function onOpen() {<br>
                var ui = SpreadsheetApp.getUi();<br>
                ui.createMenu('頁面工具')<br>
                        .addItem('FC_RM_KeyIn -> FC_RM_WH ', 'GarZ_NotePaste')<br>
                        .addItem('Vendor_KeyIn -> Vendor ', '')<br>
                    .addToUi();<br>
              }</p>
        `
    },
    {
        date:'4月7號 ,2021 , ',
        title:'上班及學習',
        content:'早上天氣不錯，上班前喝了杯咖啡，來到公司後主管要我幫他找一塊mac的液晶螢幕，不過想也知道，剛來第二天的人怎麼會知道放在哪'+
        '，找遍了所有能找的地方，主管告訴我被丟掉了<br>回到座位後我繼續看我的新進人員手冊，目前剛到職沒什麼工作，我拿起我的 ”００８天絕對看不完的 Vue.js3“，<br>就在我埋頭苦練的時候恰巧被主管看到了，本以為要被罵臭頭的時候，他告訴我說希望現在在練習的東西以後可以用上結合google script達到結合ＥＲＰ的效果，真是開明那我就繼續把我的框架能力加強吧！'
    }
    ,
    {
        date:'3月30號 ,2021 , ',
        title:'I got my offer',
        content:`今天3/30，總共面試了3家公司，拿到了2個offer，一個是網頁、系統設計；另一個則是公司的MIS工程師，但我選擇了後者；原因是因為第一家告訴我當天就會通知我結果，但他沒有這她說的一樣當天就告知我，甚至我mail他，才跟我說要在隔一個禮拜才會通知，這動作讓我有點不是很開心，馬上打給第二間說我接受他的offer，4/6就去上班。；`
    }
    ,
    {
        date:'3月17號 ,2021 , ',
        title:'關於AJAX',
        content:`<pre>
        今天是很熱的一天，下午2點時到數唯科技面試，聽了工作內容令我有點映象深刻，
        他們的主管跟我說像我這種剛畢業的人培訓是必要的，對於我這種剛畢業只懂一點前端的，
        他們可以培訓，比如說前端的angular還有.net以及C#，這些對我來說都蠻新鮮的；
        面試結束後，騎了老遠到家想說剪個頭法，第一間面試的勁峰就打給我問我要不要上班；
        
            有點掙扎，因為相比這一間就是比較傳統的公司、MIS工程師實際上是在幹嘛也聽不太懂
        回到正題，昨天練習的xmlhttprequest
        
        //總之先請求連線
         var xhr = new XMLhttpRequest();

        //接下來請求URL
        xhr.open("post/get","url",true);

        //若沒有要傳送資料"
        xhr.send(null)

        //最後是
        xhr.onload=function(){執行動作}
        </pre>
        `
    }
    ,
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