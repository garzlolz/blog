// Blog posts data as JavaScript module for fallback
window.BLOG_POSTS_DATA = {
  "blogPosts": [
    {
      "date": "10月01號,2024",
      "title": "Seq Dashboard Monitor 不同GC Mode的記憶體差異",
      "content": "<ul>\n    <li>測試條件: 100人，20分鐘總共約 69000次 Request</li>\n    <li>測試API , <code>GET</code> <a target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://api/Performance/httpGet\">api/Performance/httpGet</a></li>\n</ul>\n<pre><code class=\"language-plaintext\">[HttpGet(\"httpGet\")]\npublic async Task&lt;IActionResult&gt; HttpGet()\n{\n    using (HttpClient client = new HttpClient())\n    {\n        string getProductUrl = \"&lt;https://fakestoreapi.com/products&gt;\";\n        HttpResponseMessage response = await client.GetAsync(getProductUrl);\n\n        response.EnsureSuccessStatusCode();\n\n        // 取得回應內容\n        string responseBody = await response.Content.ReadAsStringAsync();\n        return Ok(responseBody);\n    }\n}\n</code></pre>\n<ul>\n    <li>Request Summary</li>\n</ul>\n<figure class=\"table\">\n    <table>\n        <thead>\n            <tr>\n                <th>Mode</th>\n                <th>Total Requests</th>\n                <th>Requests Per Second</th>\n                <th>Avg. Response Time</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>Server GC</td>\n                <td>69,120</td>\n                <td>54.56</td>\n                <td>628 ms</td>\n            </tr>\n            <tr>\n                <td>Workstation GC</td>\n                <td>69,158</td>\n                <td>57.28</td>\n                <td>603 ms</td>\n            </tr>\n        </tbody>\n    </table>\n</figure>\n<h2>Server Mode、Workstation Mode GC 對比</h2>\n<ul>\n    <li>Server Mode 峰值約在 6.5% 左右，Workstation CPU 峰值約在2.5%左右</li>\n    <li>Server Mode CPU使用率為 2%~6%，普遍居於 5%， Workstation Mode CPU使用率為 1.2%~2.5%，普遍居於 1.8%</li>\n    <li>Server Mode 之 Working Set 在初期高速飆升至 380MB 後緩慢下降，約在 290MB 持平， Workstation Mode 之 Working Se 在初期高速飆升至 120MB後緩慢下降，約在 70MB 持平</li>\n    <li>Server Mode 之 Allocated 約在 70MB 至 200MB左右大幅震盪 ， Workstation Mode 之 Allocated 約在 20MB 左右</li>\n</ul>\n<p><img src=\"images/20241001/1.jpg\" alt=\"GC Mode 記憶體差異圖表\" /></p>",
      "images": [
        {
          "date": "20241001",
          "imageNumber": "1",
          "path": "images/20241001/1.jpg"
        }
      ]
    },
    {
      "date": "04月23號,2024",
      "title": "北漂",
      "content": "<p><span style=\"font-size:20px;\">早</span>安各位，好久不見</p>\n    <p>身為土生土長的台中人，如今跑到台北內湖上班，</p>\n    <p>在日商NEC-PTC上班了一個月。</p>\n    <p><br>兩個月前在591上租了一間頂加6樓的租屋，</p>\n    <p>以空間來說我認為是挺大的</p>\n    <p>但可怕的是在一個月後，我發現隔音非常糟糕，在每天爬6樓的日子</p>\n    <p>我不僅得健身，還得安安靜靜，</p>\n    <p>就連晚上11點到家洗澡都被鄰居檢舉半夜用水吵到鄰居睡不著</p>\n    <p>這樣的租屋要11500，真是令人覺得不可思議，</p>\n    <p>一個人隻身上台北，又遇到這種狀況實在是令人憂愁，</p>\n    <p>看了看更遠一點的租房也是大同小異。</p>\n    <p>&nbsp;</p>\n    <p>先不管房屋的外觀，現今台北的租屋環境實在是非常惡劣，</p>\n    <p>物價、房價、生活成本都高的有點離譜</p>\n    <p>再看看房價，如今社會年輕人如果要全靠自己熬上多少個年頭。</p>\n    <p>&nbsp;</p>\n    <p>想了想我的初心，</p>\n    <p>是想要達成年薪百萬還是在有活力有熱情的小公司研究新東西、做出各式各樣的專案，</p>\n    <p>還是在這些老公司寫vb專案度日呢?</p>\n    <p>&nbsp;</p>\n    <p>我想答案很明確了，我得開始行動</p>",
      "images": []
    },
    {
      "date": "01月16號,2023",
      "title": ".Net7 && JWT",
      "content": "2023年新的開始來試試看.Net7,一直以來公司開發都是以.Net FrameWork為主，希望未來能碰到.Net Core或.Net(打開104)，\n         這次收到某公司得邀請不過得先做題目，\n         題目大致上是使用 EF完成 Restful API，面試過程很開心，該公司的氣氛讓我覺得很酷，\n         不過問了下那個地區的房租我真的是倒抽一口氣......\n\n         面試雖然結束了不過趁著今天有閒(?)，來試試看JWT吧! <a href=\"https://github.com/garzlolz/yungching_quiz\">Github</a>\n        <div>\n         (1)\n         首先打開我們的 Power Shell，安裝微軟的 JWT!\n         <img src=\"images/20230117/1.jpg\" alt=\"安裝 JWT 套件\" />\n          > dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer\n        </div>\n        <br><br>\n        <div>\n         (2)\n         接下來服務中註冊他\n         <img src=\"images/20230117/2.jpg\" alt=\"註冊 JWT 服務\" />\n         </div>\n         <br>\n         <div>\n         (3)\n         接下來我們在Controller加上 Authorize屬性\n         <img src=\"images/20230117/2_1.jpg\" alt=\"Controller 加上 Authorize\" />\n         </div>\n         <br>\n         <div>\n         (4)\n         透過Cli 產生Token\n         <img src=\"images/20230117/3.jpg\" alt=\"CLI 產生 Token\" />\n          > dotnet user-jwts create\n          </div>\n          <br><br>\n          <div>\n         (5)\n         我們會發現我們的Json悄悄的發生變化，這個部分聽說有些人的會跑到 appSetting.Json這就要看你怎麼設置了\n         <img src=\"images/20230117/4.jpg\" alt=\"JSON 設定變化\" />\n         </div>\n         <br><br>\n         <div>\n         (6)\n         好! 開始測試這邊使用的是方法 \"getAll\" 取得我們所有員工訊息，不過你可能會發現沒辦法用了\n         <img src=\"images/20230117/5.jpg\" alt=\"測試 API 無法使用\" />\n         </div>\n         <br>\n         <div>\n         (7)\n         這是因為我們還沒加上Token，如果你是用 Postman在 Authorization中的 Type選擇 Bearer Token然後加上我們剛剛產出的token\n         <img src=\"images/20230117/6.jpg\" alt=\"Postman 加上 Bearer Token\" />\n         </div>\n         <br><br>\n         <div>\n         (8)\n         最後我們在嘗試一下發一個 request試試看\n         <img src=\"images/20230117/8.jpg\" alt=\"測試 Request 成功\" />\n         </div>\n         完成~~~",
      "images": [
        {
          "date": "20230117",
          "imageNumber": "1",
          "path": "images/20230117/1.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "2",
          "path": "images/20230117/2.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "2_1",
          "path": "images/20230117/2_1.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "3",
          "path": "images/20230117/3.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "4",
          "path": "images/20230117/4.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "5",
          "path": "images/20230117/5.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "6",
          "path": "images/20230117/6.jpg"
        },
        {
          "date": "20230117",
          "imageNumber": "8",
          "path": "images/20230117/8.jpg"
        }
      ]
    },
    {
      "date": "12月8號,2022",
      "title": "台中老公司以及甲骨文",
      "content": "近期都在維護.net Framework的專案，最近因為公司要開發新版本的站台也要用新的.net Core和MVC，\n         才發現新版本的Asp.net Core更新後將原本的edmx也移除掉了，原本引入用的UI也不見了，\n         如果都要用code first的話有點麻煩，畢竟公司其實都會先開DB，table欄位也非常多的，所以還是用DB First指令更快一點\n         Scaffold-DbContext  //使用scaffold建立DBContext\n         \"<ConnectionString>\"\n         Microsoft.EntityFrameworkCore.SqlServer\n         -tables <tableName> -OutputDir <Folder> --force //如果要更新可以用force",
      "images": []
    },
    {
      "date": "10月19號,2022",
      "title": "在IIS上佈署 .Net Web",
      "content": "<h5>這一兩個月由於在忙台糖的團購，常常加班到自己眼睛好痛\n            看了眼科好險只是過度疲勞，現在每天晚上都熱敷眼睛+各種眼睛\n            的保件食品😥😥😥各位千萬要保養好自己工具阿</h5><br>\n\n        今天紀錄一下自己是如何在 IIS上佈署自己的 web應用程式\n        這邊我使用的環境是 Windows Server 2022\n        <img src=\"images/20221019/1.jpg\" alt=\"Windows Server 2022 環境\" />\n\n        <li>Windows Server2022 的介面跟使用上跟windows 2019其實是大同小異的\n        首先呢 我們需要先將 IIS加入到 Windows應用程式內</li>\n        <img src=\"images/20221019/2.jpg\" alt=\"加入 IIS 到 Windows 應用程式\" />\n\n        <li>Feature的部分則是要將.net的Runtime加入到windows中~</li>\n        <img src=\"images/20221019/3.jpg\" alt=\"加入 .NET Runtime\" />\n\n        <li>接下來我們就可以開啟 IIS Server</li>\n        <img src=\"images/20221019/4.jpg\" alt=\"開啟 IIS Server\" />\n\n        <li>在Site的選項中選擇新增站台</li>\n        <img src=\"images/20221019/5.jpg\" alt=\"新增站台\" />\n\n        <li>這裡我最近寫的楓康PDA的API為範例 填入應用程式名稱，實體路徑選\n        擇已經打包好的資料夾，port的部分的我設定在 8081這個8081需要繫好瞜</li>\n        <img src=\"images/20221019/6.jpg\" alt=\"設定站台資訊\" />\n\n        <li>好接下來打開防火牆，我們新增一個輸入輸出規則，使用連接埠的方式我\n        將他選在8081上，保存後如圖</li>\n        <img src=\"images/20221019/7.jpg\" alt=\"防火牆設定\" />\n\n        <li>接下來取得自己區網的ip</li>\n        <img src=\"images/20221019/8.jpg\" alt=\"取得區網 IP\" />\n\n        <li>最後我們就可以在相同網域上看到自己發布的網站瞜!</li>\n        <img src=\"images/20221019/9.jpg\" alt=\"網站發布成功\" />",
      "images": [
        {
          "date": "20221019",
          "imageNumber": "1",
          "path": "images/20221019/1.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "2",
          "path": "images/20221019/2.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "3",
          "path": "images/20221019/3.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "4",
          "path": "images/20221019/4.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "5",
          "path": "images/20221019/5.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "6",
          "path": "images/20221019/6.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "7",
          "path": "images/20221019/7.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "8",
          "path": "images/20221019/8.jpg"
        },
        {
          "date": "20221019",
          "imageNumber": "9",
          "path": "images/20221019/9.jpg"
        }
      ]
    }
  ]
};
