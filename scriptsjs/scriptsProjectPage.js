function SaveStatusFunction(){

    let radios = document.getElementsByName('flexRadioStatus');

    console.log("Радио");

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        document.getElementById('inputStatus').value = radios[i].value;

        break;
      }
    }
}


function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}


function addClass(id,cls) {
  ele = document.getElementById(id);
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(id,cls) {
  ele = document.getElementById(id);
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}


//мое создание колонок и картточки
// я ничего не менял в твоем коде
// прсто закометировал <82> строку с <new ListForCards(root);>
// что бы все вернуть на место коментируещь мой код и убираешь коментирование с <82> строки
function addColumn(idName, idCollumn = "тестовая_колонка") {
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempColumn");
    let clone = template.content.cloneNode(true);
    clone.setAttribute("id", idCollumn);

    let name = document.getElementById(idName).value;
    clone.getElementById("nameColum").innerHTML = name;


    let listComent = document.getElementById("addColumn");
    listComent.before(clone);
  }
}


function addCard(idCard = "тестовая_карточка"){
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempCard");
    let clone = template.content.cloneNode(true);

    clone.setAttribute("id", idCard);
    let name = document.getElementById(idName).value;
    clone.getElementById("nameColum").innerHTML = name;

    let listComent = document.getElementById("addColumn");
    listComent.before(clone);
  }
}

//Логика карточек
let root = document.getElementById("board");

class ListForCards{
  constructor(place, title="To do"){
    this.place=place;
    this.title=title;
    this.cardList=[];

    this.render();
  }

  render(){
    this.createListForCards();
    this.place.append(this.divCol);
  }

  addCardFunc(){
    this.cardList.push(new Card(this.divListContent, this));
  }

  createListForCards(){
    this.divCol = document.createElement('div');
    this.divCol.classList.add('col-my');
    this.divCol.classList.add('col-3');

    this.divHeader = document.createElement('div');
    this.divHeader.classList.add('col-header');

    this.AddCardBtn = document.createElement('button');
    this.AddCardBtn.type = "button";
    this.AddCardBtn.classList.add('button-new-card');
    this.AddCardBtn.ariaLabel = "Добавить новую карточку";

    this.AddCardBtn.ariaExpanded = false;
        this.AddCardBtn.addEventListener('click', ()=>{
      console.log("Новая карточка");
      this.addCardFunc(this.ListForCards);
    })

    this.AddCardBtn.innerHTML = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-plus">' +
                                      '<path fill-rule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>' +
                                  '</svg>';

    this.divHeader.innerHTML = '<span title="0" data-view-component="true" class="number-cards">0</span>' +
                                '<h3 class="name-column"><span>To do</span></h3>' +
                                '<details class="column-menu">' +
                                  '<summary class="column-menu" aria-label="Column menu" aria-haspopup="menu" role="button">' +
                                    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-kebab-horizontal">' +
                                      '<path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>' +
                                    '</svg>' +
                                  '</summary>' +
                                  '<div class="open">' +
                                    '<button type="button" name="button">удалить столбец</button>' +
                                  '</div>' +
                                '</details>';

    this.divHeader.append(this.AddCardBtn);

    this.divListContent = document.createElement('div');
    this.divListContent.classList.add('col-content');


    this.divCol.append(this.divHeader);
    this.divCol.append(this.divListContent);
  }
}

class Card{
  constructor(place, listForCards){
    this.place = place;
    this.listForCards = listForCards;

    this.render();
  }

  render(){
    this.createCardElement();
    this.place.append(this.card);
  }

  createCardElement(){
    this.card = document.createElement('div');
    this.card.classList.add('card');
    this.card.innerHTML = '<span class="card-svg">' +
                            '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-note">' +
                              '<path fill-rule="evenodd" d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5zm1.75-.25a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H1.75zM3.5 6.25a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z"></path>' +
                            '</svg>' +
                          '</span>' +
                          '<div class="card-content"></div>' +
                          '<small class="add-info color-fg-muted">Добавлено<a class="color-text-primary" href="#" draggable="false">Josen190</a></small>';
  }
}

// Main
let addColumnBtn = document.getElementById("addColumn");

addColumnBtn.addEventListener('click', ()=>{
  new ListForCards(root);
  console.log("Добавить колонку");
})
