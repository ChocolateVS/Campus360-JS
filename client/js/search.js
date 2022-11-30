/***************** Search Stuff ******************/



//Focuses Searchbox
document.getElementById("search_input").addEventListener("focus", function() {
    $('#search_container').css('border-radius', '10px 10px 0px 0px');
    $('#search_container').css('background-color', 'rgb(222 218 218 / 85%)');
    id("search_results").style.display = "flex";
});


//Defocuses searchbox
 document.getElementById("panorama").addEventListener("mousedown", function() {
     removeFocusFromSearch();
 });
 document.getElementById("panorama").addEventListener("touch", function() {
     removeFocusFromSearch();
 });

function removeFocusFromSearch() {
    document.activeElement.blur();
    $('#search_container').css('border-radius', '10px');
    $('#search_container').css('background-color', 'transparent');
    id("search_results").style.display = "none";
}



 

//Filters & Populates searchbox
let roomSearchEntries = []
const roomEntryTemplate = document.querySelector("[template-room]")
const roomEntryResults = document.querySelector("[data-room-results]")
const roomSearch = document.querySelector("[data-room-search]")


const output = document.querySelector(".output");
const search = document.querySelector(".search_input");

function loadList(list) {
    if(list.length <= 0) {output.innerHTML = '<div> No Rooms Found! </div>'; return;}
    output.innerHTML = '';
    list.forEach((item) => {
    output.append(item.element);
    });
  }
  

function filter(e) {
  loadList(roomSearchEntries.filter(item=> 
    item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
    item.owner.toLowerCase().includes(e.target.value.toLowerCase())
    ))
}

async function setupSearch(){
let roomsRaw = await fetch(API_PREFIX + '/api/project/'+localStorage.getItem(LOCALSTORAGE_PROJECT)+'/rooms')
let roomsJSON = await roomsRaw.json()
roomSearchEntries = roomsJSON.payload.map(room =>{
    const roomObj = roomEntryTemplate.content.cloneNode(true).children[0]
    const name = roomObj.querySelector('[template-room-name]')
    const owner = roomObj.querySelector('[template-room-owner]')
    name.textContent = room.name;
    owner.textContent = "Occupant:" + room.owner;
    return {name: room.name, owner: room.owner, element: roomObj}
})

loadList(roomSearchEntries)

search.addEventListener("input", filter);
}

setupSearch();