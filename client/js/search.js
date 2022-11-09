/***************** Search Stuff ******************/

//Focuses Searchbox
document.getElementById("locationInput").addEventListener("focus", function() {
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

roomSearch.addEventListener('input', e =>{
const value = e.target.value.toLowerCase();
roomSearchEntries.forEach(room =>{
    const isVisible = room.name.toLowerCase().includes(value) || room.owner.toLowerCase().includes(value)
    room.element.classList.toggle('hide', !isVisible)
})
});

fetch('https://campus.rowansserver.com/api/rooms').then(res => res.json())
.then(data => {
roomSearchEntries = data.payload.map(room =>{
    const roomObj = roomEntryTemplate.content.cloneNode(true).children[0]
    const name = roomObj.querySelector('[template-room-name]')
    const owner = roomObj.querySelector('[template-room-owner]')
    name.textContent = room.name;
    owner.textContent = room.owner;
    roomEntryResults.append(roomObj)
    return {name: room.name, owner: room.owner, element: roomObj}
})
})