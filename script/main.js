function gett(){
    var name = document.getElementById('name').value;
    if(name == 0){return};
    document.getElementById('change').textContent = name + '，你好!';
}


var data=[
    {
        date:'3月6號 ,2021   ,施宏勳 ,  ',
        title:'關於localStorage',
        content:"今天複習js，在練習todoList 的 localStorage，setitem，以及getitem的方式;<br>搭配陣列的 push.data 和 splice.data 紀錄一下<br>從localstorage上抓下來的話，要將array轉成String<br> JSON.parse(localStorage.getItem('listdata',Data)) <br>上傳則要將Array轉為String所以則是 <br>JSON.stringify(localStorage.setItem('listData',Data)); <br> 陣列可以分別用 push.data 和 splice.data的方式，將資料push到陣列或刪除。",
    },
]

for(var i=0;i<data.length;i++){
    var  cont = "";
    var titles = document.querySelector('.title1')
    var contents = document.querySelector('.content1');
    titles.textContent  =  data[i].title;
    contents.innerHTML  = data[i].date+data[i].content;
    cont 
}