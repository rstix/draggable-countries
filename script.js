const draggable_list = $('#draggable-list')
const check = $('#check')

const endpoint = 'https://restcountries.com/v3.1/all';

const countries = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => countries.push(...data.sort((a, b) => b.population - a.population)));

let dragStartIndex;

setTimeout(() => {
  $('#overlay').addClass('hide')
  createList()
}, 2000)

const listItems = []

const createList = () => {
  [...countries].slice(0,10)
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .forEach((c, i) => {

      const listItem = document.createElement('li');
      listItem.setAttribute('data-index', i);

      listItem.innerHTML = `
        <span class="number">${i + 1}</span>
        <div class="draggable" draggable="true">
          <p class="country-name">${c.value.name.common}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      ` ;

      listItems.push(listItem);

      draggable_list.append(listItem);
    })
  
  addEventListeners()
}

function dragStart(){
  dragStartIndex = +$(this).closest('li').data('index')
}

function dragEnter(){
  $(this).addClass('over')
}

function dragLeave () {
  $(this).removeClass('over')
}

function dragOver(e) {
  e.preventDefault()
}

function dragDrop() {
  const dragEndIndex = +$(this).data('index')
  swapIndex(dragStartIndex, dragEndIndex)
  
  $(this).removeClass('over')
}

const swapIndex = (from, to) => {
  const itemOne = $(listItems[from]).find('.draggable')
  const itemTwo = $(listItems[to]).find('.draggable')

  $(listItems[from]).append(itemTwo)
  $(listItems[to]).append(itemOne)
}

const addEventListeners = () => {
  const draggables = $('.draggable')
  const draggableItems = $('.draggable-list li')

  draggables.on('dragstart', dragStart)

  draggableItems.on('dragover', dragOver)
  draggableItems.on('drop', dragDrop)
  draggableItems.on('dragenter', dragEnter)
  draggableItems.on('dragleave', dragLeave)
}

const checkOrder = () => {
  listItems.forEach((item, i) => {
    const cName = $(item).find('.draggable').text().trim()
    if (cName !== countries[i].name.common) {
      $(item).addClass('wrong')
    } else {
      $(item).removeClass('wrong')
      $(item).addClass('right')
    }
  })
}
 
$(check).on('click',checkOrder)