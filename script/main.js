alert('歡迎')

function gett(){
    var name = document.getElementById('name').value;
    if(name == 0){return};
    document.getElementById('change').textContent = name + '，你好!';
}
