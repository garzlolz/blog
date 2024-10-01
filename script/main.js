var blogPost = document.querySelector(".posted");
var RecentPost = document.querySelector(".list-unstyled");
var bigDisplay_titl = document.querySelector(".display-4");
var bigDisplay_date = document.querySelector(".my-3");
var bigDisplay_more = document.querySelector(".mb-0");

var AddImg = (Folder, Name) => {
  return `<br><img src="../media/pictures/${Folder}/${Name}.jpg" width="640px" heigh="360px" alt="一張圖片"><br><br>`;
};
var AddTag = (tag, content) => {
  return `<${tag}>${content}</${tag}>`;
};
var data = [
  {date:"10月01號,2024",
  title:"Seq Dashboard Monitor 不同GC Mode的記憶體差異",
  content:`<ul>
    <li>測試條件: 100人，20分鐘總共約 69000次 Request</li>
    <li>測試API , <code>GET</code> <a target="_blank" rel="noopener noreferrer" href="https://api/Performance/httpGet">api/Performance/httpGet</a></li>
</ul>
<pre><code class="language-plaintext">[HttpGet("httpGet")]
public async Task&lt;IActionResult&gt; HttpGet()
{
    using (HttpClient client = new HttpClient())
    {
        string getProductUrl = "&lt;https://fakestoreapi.com/products&gt;";
        HttpResponseMessage response = await client.GetAsync(getProductUrl);

        response.EnsureSuccessStatusCode();

        // 取得回應內容
        string responseBody = await response.Content.ReadAsStringAsync();
        return Ok(responseBody);
    }
}
</code></pre>
<ul>
    <li>Request Summary</li>
</ul>
<figure class="table">
    <table>
        <thead>
            <tr>
                <th>Mode</th>
                <th>Total Requests</th>
                <th>Requests Per Second</th>
                <th>Avg. Response Time</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Server GC</td>
                <td>69,120</td>
                <td>54.56</td>
                <td>628 ms</td>
            </tr>
            <tr>
                <td>Workstation GC</td>
                <td>69,158</td>
                <td>57.28</td>
                <td>603 ms</td>
            </tr>
        </tbody>
    </table>
</figure>
<h2>Server Mode、Workstation Mode GC 對比</h2>
<ul>
    <li>Server Mode 峰值約在 6.5% 左右，Workstation CPU 峰值約在2.5%左右</li>
    <li>Server Mode CPU使用率為 2%~6%，普遍居於 5%， Workstation Mode CPU使用率為 1.2%~2.5%，普遍居於 1.8%</li>
    <li>Server Mode 之 Working Set 在初期高速飆升至 380MB 後緩慢下降，約在 290MB 持平， Workstation Mode 之 Working Se 在初期高速飆升至 120MB後緩慢下降，約在 70MB 持平</li>
    <li>Server Mode 之 Allocated 約在 70MB 至 200MB左右大幅震盪 ， Workstation Mode 之 Allocated 約在 20MB 左右</li>
</ul>
<p>${AddImg(20241001, 1)}</p>`
  },
  {
    date: `04月23號,2024 ,`,
    title: "北漂",
    content: `<p><span style="font-size:20px;">早</span>安各位，好久不見</p>
    <p>身為土生土長的台中人，如今跑到台北內湖上班，</p>
    <p>在日商NEC-PTC上班了一個月。</p>
    <p><br>兩個月前在591上租了一間頂加6樓的租屋，</p>
    <p>以空間來說我認為是挺大的</p>
    <p>但可怕的是在一個月後，我發現隔音非常糟糕，在每天爬6樓的日子</p>
    <p>我不僅得健身，還得安安靜靜，</p>
    <p>就連晚上11點到家洗澡都被鄰居檢舉半夜用水吵到鄰居睡不著</p>
    <p>這樣的租屋要11500，真是令人覺得不可思議，</p>
    <p>一個人隻身上台北，又遇到這種狀況實在是令人憂愁，</p>
    <p>看了看更遠一點的租房也是大同小異。</p>
    <p>&nbsp;</p>
    <p>先不管房屋的外觀，現今台北的租屋環境實在是非常惡劣，</p>
    <p>物價、房價、生活成本都高的有點離譜</p>
    <p>再看看房價，如今社會年輕人如果要全靠自己熬上多少個年頭。</p>
    <p>&nbsp;</p>
    <p>想了想我的初心，</p>
    <p>是想要達成年薪百萬還是在有活力有熱情的小公司研究新東西、做出各式各樣的專案，</p>
    <p>還是在這些老公司寫vb專案度日呢?</p>
    <p>&nbsp;</p>
    <p>我想答案很明確了，我得開始行動</p>`,
  },
  {
    date: "01月16號,2023 ,",
    title: ".Net7 && JWT ",
    content: `2023年新的開始來試試看.Net7,一直以來公司開發都是以.Net FrameWork為主，希望未來能碰到.Net Core或.Net(打開104)，
         這次收到某公司得邀請不過得先做題目，
         題目大致上是使用 EF完成 Restful API，面試過程很開心，該公司的氣氛讓我覺得很酷，
         不過問了下那個地區的房租我真的是倒抽一口氣......

         面試雖然結束了不過趁著今天有閒(?)，來試試看JWT吧! <a href="https://github.com/garzlolz/yungching_quiz">Github</a>
        <div>
         (1)
         首先打開我們的 Power Shell，安裝微軟的 JWT!
         ${AddImg(20230117, 1)}
          > dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
        </div>
        <br><br>
        <div>
         (2)
         接下來服務中註冊他
         ${AddImg(20230117, 2)}
         </div>
         <br>
         <div>
         (3)
         接下來我們在Controller加上 Authorize屬性
         ${AddImg(20230117, "2_1")}
         </div>
         <br>
         <div>
         (4)
         透過Cli 產生Token
         ${AddImg(20230117, 3)}
          > dotnet user-jwts create
          </div>
          <br><br>
          <div>
         (5)
         我們會發現我們的Json悄悄的發生變化，這個部分聽說有些人的會跑到 appSetting.Json這就要看你怎麼設置了
         ${AddImg(20230117, 4)}
         </div>
         <br><br>
         <div>
         (6)
         好! 開始測試這邊使用的是方法 "getAll" 取得我們所有員工訊息，不過你可能會發現沒辦法用了
         ${AddImg(20230117, 5)}
         </div>
         <br>
         <div>
         (7)
         這是因為我們還沒加上Token，如果你是用 Postman在 Authorization中的 Type選擇 Bearer Token然後加上我們剛剛產出的token
         ${AddImg(20230117, 6)}
         </div>
         <br><br>
         <div>
         (8)
         最後我們在嘗試一下發一個 request試試看
         ${AddImg(20230117, 8)}
         </div>
         完成~~~
        `,
  },
  {
    date: "12月8號,2022 ,",
    title: "台中老公司以及甲骨文 ",
    content: `近期都在維護.net Framework的專案，最近因為公司要開發新版本的站台也要用新的.net Core和MVC，
         才發現新版本的Asp.net Core更新後將原本的edmx也移除掉了，原本引入用的UI也不見了，
         如果都要用code first的話有點麻煩，畢竟公司其實都會先開DB，table欄位也非常多的，所以還是用DB First指令更快一點
         Scaffold-DbContext  //使用scaffold建立DBContext
         "<ConnectionString>"
         Microsoft.EntityFrameworkCore.SqlServer
         -tables <tableName> -OutputDir <Folder> --force //如果要更新可以用force`,
  },
  {
    date: "10月19號,2022 ,",
    title: "在IIS上佈署 .Net Web",
    content: `${AddTag(
      "h5",
      `這一兩個月由於在忙台糖的團購，常常加班到自己眼睛好痛
            看了眼科好險只是過度疲勞，現在每天晚上都熱敷眼睛+各種眼睛
            的保件食品😥😥😥各位千萬要保養好自己工具阿`
    )}<br>

        今天紀錄一下自己是如何在 IIS上佈署自己的 web應用程式
        這邊我使用的環境是 Windows Server 2022
        ${AddImg(20221019, 1)}

        ${AddTag(
          "li",
          `Windows Server2022 的介面跟使用上跟windows 2019其實是大同小異的
        首先呢 我們需要先將 IIS加入到 Windows應用程式內`
        )}
        ${AddImg(20221019, 2)}

        ${AddTag("li", "Feature的部分則是要將.net的Runtime加入到windows中~")}
        ${AddImg(20221019, 3)}

        ${AddTag("li", "接下來我們就可以開啟 IIS Server")}
        ${AddImg(20221019, 4)}

        ${AddTag("li", "在Site的選項中選擇新增站台")}
        ${AddImg(20221019, 5)}

        ${AddTag(
          "li",
          `這裡我最近寫的楓康PDA的API為範例 填入應用程式名稱，實體路徑選
        擇已經打包好的資料夾，port的部分的我設定在 8081這個8081需要繫好瞜`
        )}
        ${AddImg(20221019, 6)}

        ${AddTag(
          "li",
          `好接下來打開防火牆，我們新增一個輸入輸出規則，使用連接埠的方式我
        將他選在8081上，保存後如圖`
        )}
        ${AddImg(20221019, 7)}

        ${AddTag("li", "接下來取得自己區網的ip")}
        ${AddImg(20221019, 8)}

        ${AddTag("li", "最後我們就可以在相同網域上看到自己發布的網站瞜!")}
        ${AddImg(20221019, 9)}
        `,
  },
  {
    date: "8月18號,2022 ,",
    title: "EF Core、近期工作 ",
    content: `近期都在維護.net Framework的專案，最近因為公司要開發新版本的站台也要用新的.net Core和MVC，
         才發現新版本的Asp.net Core更新後將原本的edmx也移除掉了，原本引入用的UI也不見了，
         如果都要用code first的話有點麻煩，畢竟公司其實都會先開DB，table欄位也非常多的，所以還是用DB First指令更快一點
         Scaffold-DbContext  //使用scaffold建立DBContext
         "<ConnectionString>"
         Microsoft.EntityFrameworkCore.SqlServer
         -tables <tableName> -OutputDir <Folder> --force //如果要更新可以用force`,
  },
  {
    date: "7月13號,2022 ,",
    title: "近期學習、工作概略",
    content: `OK，目前對於 .NET、MVC、以及 ADO.NET(Entity FrameWork)有大致上了解了，<br>
        這幾個月參與開發、維護公司模組專案以及幾個訂單轉出的Console App，<br>
        老實說SQL可能是我面臨大大的短板，<br>
        在習慣用EF做一些基本的select、AddorUpdate、SaveChange心想:"诶?原來這麼簡單又輕鬆"，<br>
        雖然都是使用DB first而是code first的方式但目前還沒遇到網路上說的"問題"，<br>
        此外要運用到left Join的時候一Google :"嘔天 這什麼鬼"馬上又改回sql coommand的方式，<br>
        這部分還須再加強練習。<br>
        另外我發現在Visual Studio上開發MVC真的是一件很麻煩的事情、不管怎樣都要給你重啟個幾次，<br>
        修改一個class的型別 抱歉你得重啟阿 哥，你說氣不氣人? <br>
        BTW 最近換新的設備14個core的i7-12700H 16G DDR5 滿功率的3050Ti ，<br>
        再加上2.5K以及165HZ的分辨率，<br>
        這個規格你在台灣入手肯定是4W5起跳...但!<br>
        對、但!這個配置我再京東上找到了Y7000P國際板應該是legion 5i?(不是很確定)<br>
        我從聯想官網點一點相同的配置 "$52700" <br>
        台灣的OEM廠商真的是坑殺人了，別說聯想了，<br>
        "華碩"這個'台灣'品牌不只是價格在台灣賣得比誰都貴<br>
        甚至對產品做閹割你甚至無法在台灣只到一台4W以內的滿血顯卡筆電，<br>
        最後從京東購入的Y7000P我只能說:"真香"`,
  },
  {
    date: "2月25號,2022 ,",
    title: "C#、ASP.NET ",
    content: `在國興裡面待了3個月, 目前的心得想在這上面記錄一下, 這三個月期間我認為我是學到很多, 包括.net 6 以及 MVC 架構, 從自己原本只想做前端到目前接觸到C#、webAPI、MVC網頁以及jQuery，在短短的時先內真的接觸到很多，但也了解到其實公司框架這種東西雖然真的方便快速好維護，但是真的會限制你的想法、作法。
         目前2月25號正在執行的業務是楓康外送平台的分店建檔網頁、Webhook比如說像是UBER EAT那邊的失敗成功訊息再SQL上的紀錄顯示再網頁上`,
  },
  {
    date: "12月21號,2021 ,",
    title: "C# 好像似懂非懂",
    content: `可能先前太常使用 var、const 在 C# 中卻必須要明確規範變數、參數的型別、再加上vs community 的熱鍵其實非常難用...，寫起來確實挺折磨人的，不過第一個禮拜學到了如何製作web api以及幾個簡單的winform 、使用C# 的http傳輸 post、get等方法，不得不說，好久沒有這種學到新東西的感覺了...意外的開心`,
  },
  {
    date: "12月10號,2021 ,",
    title: "New Offer C# .net工程師",
    content: `12/6號 我轉職成為winform全端工程師的職位，主要工作初步認識應該是pos機跟DB的作業，據了解客戶好像是喫茶，糖村跟多那支。今天剛好是入職的第一個禮拜五。期待接下來的各種挑戰。`,
  },
  {
    date: "10月12號,2021 ,",
    title: "Google App Script X GitHub",
    content: `<p>在Google Extend商店裡 找到 <a href="https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo">Google Apps Script GitHub Assistant</a></p>
     <p>下載後要設定GitHub Access 的 token<a href= "https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token">Creating a personal access token</a></p>
     <p>要記得將App script 的 Google Apps Script API開啟</p>
     <p>登入插件後接下來就可以在script 裡面看到 pull push跟 commit</p>
     <p>就大功告成啦!</p>`,
  },
  {
    date: "8月3號,2021 ,",
    title: "要怎麼讓能力變更好...?",
    content: `<p>很久沒更新了，目前工作3個月，我對自己越來越沒信心。</p>
      <p>最近幾次的工作任務，我都沒能很好的將長官給的任務的完成，可能真的能力太差，讓我有想進修的念頭</p>
      <p>上禮拜去聯成問了相關的補習，我想再進修我的語言能力，想把工作好好地做完。</p>
      <p>一到了聯城電腦 她告訴惡我相關的工作職缺，又講了市場缺什麼人才，但那都不是我想聽的，我只是想讓自己能進修變得更好</p>
      <p>最後他才告訴了我價錢<strong>18萬</strong>， 噢天阿，原來補一個能力需要花費我這麼金錢，對一個剛出社會的小白來說 18萬是什麼樣的天文數字</p>
      <p>回到了家，看了看我剛拿到的畢業證書，身為資訊工程系 我覺得如此丟臉羞恥</p>
      <p>到底該怎麼...讓自己變得更強，還是我根本不是寫code的料?</p>`,
  },
  {
    date: "5月5號 ,2021 ,",
    title: "Line Notify API",
    content: `
        <p>使用Line Notify 結合 GAS 串接政府的JSON 在設定好觸發條件就可以製作自己的天氣預報</p>
        <p>Step 1: 先在 <a href="https://notify-bot.line.me/zh_TW/">Line Notify</a> 登入後取得權杖(權杖一定要記得)</p>
        <p>Step 2: 在ＧＡＳ寫入：</p><br><br>
        <pre>
        var LineToken = '[剛剛取得的權杖]';             //權杖會一直保留直到你斷開連結

        /*** 接下來可以在各種開放資料取的各種想要的資料再作處理 ***/

        var LineText = data ;                         //帶入參數到function
        sendToLine(LineText);

        function sendToLine(LineText){
            var token = LineToken;
            var formData={                            //要發送的訊息
                "message":LineText,
                };
            var options = {
                "method":"post",
                "payload":formData,
                "headers":{
                "Authorization":"Bearer "+ token,
                "Content-Type" : "application/x-www-form-urlencoded"
                      }
              };
            Logger.log(options.payload)
            UrlFetchApp.fetch('https://notify-api.line.me/api/notify',options)
            Logger.log('已發布')
        </pre>
     `,
  },
  {
    date: "5月5號 ,2021 .",
    title: "Google APP Script 與微軟Teams 對接",
    content: `
        &nbsp&nbsp 
        今天任務是將GAS跟Teams對接，在頻道中發出訊息,所以使用方法是post
      <br><pre>
    var MicroSoft_token = '[權杖]';             //從MicroSoft Graph取得Token

    function toMsGraph(){
        var token = MicroSoft_toke;
        var formData={
            body: {                            //訊息要放在'body裡'
            content: '[要發出的訊息]'
            }
        };
        var options={
        "method":'post',                       //方法使用POST
        "payload":JSON.stringify(formData),    //要記得轉成json字串
        "headers":{
        "Authorization": "Bearer " + token,
        "Content-Type" : "application/json"    //使用json格式
        },
        muteHttpExceptions:true
    }

    var response =  UrlFetchApp.fetch('https://graph.microsoft.com/v1.0/teams/
                                [團隊ID]/channels/[頻道ID]/messages/',options)

    var json = JSON.parse(response.getContentText());
    Logger.log(json)
    }
        </pre>
      `,
  },
  {
    date: "4月29號 ,2021 , ",
    title: "處理 JS ARRAY TO CSV 中的 COMMA",
    content: `

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
                    <pre>if(v[row][col].toString().indexOf(",")!=-1){</pre>
                    <pre>v[row][col] = '"'+ v[row][col] + '"';
                         };
                     };
               }</pre>
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
        `,
  },
  {
    date: "4月13號 ,2021 , ",
    title: "Google APP Script 新嘗試",
    content: `
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
        `,
  },
  {
    date: "4月7號 ,2021 , ",
    title: "上班及學習",
    content:
      "早上天氣不錯，上班前喝了杯咖啡，來到公司後主管要我幫他找一塊mac的液晶螢幕，不過想也知道，剛來第二天的人怎麼會知道放在哪" +
      "，找遍了所有能找的地方，主管告訴我被丟掉了<br>回到座位後我繼續看我的新進人員手冊，目前剛到職沒什麼工作，我拿起我的 ”００８天絕對看不完的 Vue.js3“，<br>就在我埋頭苦練的時候恰巧被主管看到了，本以為要被罵臭頭的時候，他告訴我說希望現在在練習的東西以後可以用上結合google script達到結合ＥＲＰ的效果，真是開明那我就繼續把我的框架能力加強吧！",
  },
  {
    date: "3月30號 ,2021 , ",
    title: "I got my offer",
    content: `今天3/30，總共面試了3家公司，拿到了2個offer，一個是網頁、系統設計；另一個則是公司的MIS工程師，但我選擇了後者；原因是因為第一家告訴我當天就會通知我結果，但他沒有這她說的一樣當天就告知我，甚至我mail他，才跟我說要在隔一個禮拜才會通知，這動作讓我有點不是很開心，馬上打給第二間說我接受他的offer，4/6就去上班。；`,
  },
  {
    date: "3月17號 ,2021 , ",
    title: "關於AJAX",
    content: `<pre>
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
        `,
  },
  {
    date: "3月14號 ,2021  ,  ",
    title: "找工作",
    content:
      "終於畢業了，現在正在尋找各種前端的工作機會，也順便把部落格的方式改成用陣列輸出，打工這邊也決定在26號結束了，希望接下來可以找到自己喜歡的工作...",
  },
  {
    date: "3月6號 ,2021  ,  ",
    title: "關於localStorage",
    content:
      "今天複習js，在練習todoList 的 localStorage，setitem，以及getitem的方式;<br>搭配陣列的 push.data 和 splice.data 紀錄一下<br><br>從localstorage上抓下來的話，要將array轉成String<br> JSON.parse(localStorage.getItem('listdata',Data)) <br><br>上傳則要將Array轉為String所以則是<br> <br>JSON.stringify(localStorage.setItem('listData',Data)); <br> 陣列可以分別用 push.data 和 splice.data的方式，將資料push到陣列或刪除。",
  },
  {
    date: "3月5號 ,2021 , ",
    title: "專題結束",
    content:
      "3月5號這天是我專題評審的日子，在中午和老師面談後，我在兩點的時候進行專題評審;我認為完成度很高了，有硬體、有資料庫(MySQL/Apach server)、也有網頁(html5/css3/javascript/jQuery/Boostrap)，再搭配PHP，我認為以我自己一個人做專題其實已經可以抬頭挺胸的跟老師們報告了，不過上台的時候還是有點緊張，真的是嚇死我哈哈哈哈，接下來就是找工作，在7月就可以拿到畢業證書了",
  },
  {
    date: "2月23號 ,2021 , ",
    title: "109 第二學期",
    content:
      "這個專題老師是從業界過來的，但很明顯他的名聲一點都不好，學弟也非常討厭他；第二學期開始了，找老師meeting卻被以讀，從上學期11月就跟我說準備告報、準備PTT，東西都準備好了；但老師卻不理我，真看不懂到底在幹嘛...，明天是這學期第一次meeting，住我一帆風順...",
  },
  {
    date: "2月2號 ,2021 , ",
    title: "微創動刀",
    content:
      "今天是開完刀兩天後，動完刀只能說現在醫療器材真的進步很多，仔細看傷口小到一個爆炸，甚至還有一個什麼凝膠的可以不用縫合傷口，真的厲害。<br><br>不過修復期也要1到兩個月，光是這兩天我光睡覺都被痛醒，真的是沒吃止痛藥睡不著，痛到爆阿哈哈哈，回想起當天開刀的心情，真的是講真到爆炸，先拿一根針從我脊椎旁邊戳一個洞進去，我靠!真的是我打麻醉還痛到哭出來，真的非常痛，後來痛到沒意識，在麻醉復甦室休息了3個小時才出來，真的很痛啊哈哈哈。",
  },
  {
    date: "1月29號 ,2021 , ",
    title: "開刀",
    content:
      "今天是人生第一次開刀，雖然說是開刀，但其實也不過是微創手術，但不知道為什麼就是怕怕的，想到不是全身麻醉而是只有局部，一開始還沒這個感覺，不過到了要住院還是快尿出來了= =<br><br>不管怎麼說，我只能說人生遇到什麼就要去面對，不要想太多垃圾話，做就對了，醫生告知我要開刀我二話不說就要做，不管結果怎麼樣，2021祝大家都新年快樂",
  },
  {
    date: "1月 15號, 2021 , ",
    title: "想當初那個胎死腹中的專題",
    content:
      "大三的時候, 當時做了一個APP 叫做抽爆的APP<br>" +
      "先不管當時做得怎麼樣 <strong>抽爆</strong> 是我當初和同學一起合作做出來的APP<br><br>總之 <em>抽爆</em> 是利用爬蟲的方式將所有抽獎的機會匯集成一個資料庫table裡面包含了源網址、獎品、以及官方要求的抽獎方法<br><br>這個APP我們最終是使用了安卓studio做了出來，但是畫面很陽春，現在想想真的是醜到一個爆炸，甚至沒有流失體的把它刪掉了<br><br>總之最後這個APP老師是不採用了，我有點絕望，畢竟花了1年的時間從無到有生出來一個APP也不是什麼簡單事情；反正身為學生的我有點自暴自棄，甚至身上大4也不想做任何事情",
  },
  {
    date: "11月3號, 2020 , ",
    title: "IOT空氣盒子",
    content:
      "不知不覺竟然要延畢真的是差點笑死,雖然自己本來就知道自己因為專題要延畢，不過面對事實還真的是無能為力，總而言之是想到了一個題目<strong>空氣盒子</strong> 就是一個用兩顆sensor和Arduino做硬體，然後使用網頁當UI的一個project<br><br>" +
      "最初<em>空氣盒子</em>這個東西我原本覺得應該花個1個月自己應該就可以做完.<br><br>" +
      "不過最後我發現電路雖然接好了不過電路卻不會動拿了三用電表才發現VCC跟GND的腳位我搞錯了，重新裝上新的sensor然後再和上電路卻又發現電路還是死的!原來另位一顆sensor也被我燒掉了。沒想到上大學還要一直跑電子街，傻爆眼:(",
  },
];

var list = "";
var str = "";
for (var i = 0; i < data.length; i++) {
  str +=
    '<article class="blog-post"><h2 class="blog-post-title" id="post' +
    i +
    '">' +
    data[i].title +
    "</h2>" +
    '<p class="blog-post-meta">' +
    data[i].date +
    '<a href="https://www.instagram.com/garz.1333/">施宏勳</a></p>' +
    "<p>" +
    data[i].content +
    "</p>" +
    "</article>";
  list += '<li><a href="#post' + i + '">' + data[i].title + "</li>";

  RecentPost.innerHTML = list;
  blogPost.innerHTML = str;
}

bigDisplay_titl.innerHTML = data[0].title;
bigDisplay_date.innerHTML =
  data[0].date + "<br>" + data[0].content.slice(0, 100) + ".......";
bigDisplay_more.innerHTML =
  '<a href="#post0" class="text-white fw-bold">更多...</a>';

let paginationLeftPos = "20px";
let paginationOpacity = 0;
let checkPaginationClick = 0;

$(".pagination-page-number").click(function () {
  $(".pagination-page-number").removeClass("active");
  $(this).addClass("active");
  paginationLeftPos = $(this).prop("offsetLeft") + "px";
  paginationOpacity = 1;
  checkPaginationClick = 1;

  $(".pagination-hover-overlay").css({
    left: paginationLeftPos,
    backgroundColor: "#00178a",
    opacity: paginationOpacity,
  });
  $(this).css({
    color: "#fff",
  });
});

$(".pagination-page-number").hover(
  function () {
    paginationOpacity = 1;
    $(".pagination-hover-overlay").css({
      backgroundColor: "#00c1dd",
      left: $(this).prop("offsetLeft") + "px",
      opacity: paginationOpacity,
    });

    $(".pagination-page-number.active").css({
      color: "#333d45",
    });

    $(this).css({
      color: "#fff",
    });
  },
  function () {
    if (checkPaginationClick) {
      paginationOpacity = 1;
    } else {
      paginationOpacity = 0;
    }

    $(".pagination-hover-overlay").css({
      backgroundColor: "#00178a",
      opacity: paginationOpacity,
      left: paginationLeftPos,
    });

    $(this).css({
      color: "#333d45",
    });

    $(".pagination-page-number.active").css({
      color: "#fff",
    });
  }
);
