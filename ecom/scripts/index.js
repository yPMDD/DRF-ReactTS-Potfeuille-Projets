const search =  document.getElementsById('search');
const search_box = document.getElementById("search_box");
if(search.checked){
    search_box.style.visibility="visible";
    search.style.visibility="hidden";
}