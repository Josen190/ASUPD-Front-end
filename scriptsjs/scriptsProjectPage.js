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

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

//  логика класов HTML
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
function addColumn(idName) {
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempColumn");
    let clone = template.content.cloneNode(true);

    let name = document.getElementById(idName).value;

    clone.getElementById("nameColum").innerHTML = name;
    let listComent = document.getElementById("addColumn");
    listComent.before(clone);
  }
}


function addCard(){
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempCard");
    let clone = template.content.cloneNode(true);

    let name = document.getElementById(idName).value;

    clone.getElementById("nameColum").innerHTML = name;
    let listComent = document.getElementById("addColumn");
    listComent.before(clone);
  }
}

// здесть кончается мой код

//что то там у димы

// Main
let addColumnBtn = document.getElementById("createColumn");

addColumnBtn.addEventListener('click', ()=>{
  console.log("Была нажата addColumnBtn");
  //new ListForCards(root);
})

//Логика карточек. Определяем место, куда будем помещать колонки
let root = document.getElementById("board");

class ListForCards{
  constructor(place, title="новая колонка"){
    let name = document.getElementById("nameColumInput");
    if (name.value != "") title = name.value;
    name.value = "";

    this.place=place;
    this.title=title;
    this.cardList=[];

    this.render();
  }

  render(){
    this.createListForCards(); //Создаём html форму колонки
    this.place.append(this.divCol); //Присоеденяем созданную колонку к контейнеру root
  }

  //Создаём форму для заполнения карточки
  addCardFormFunc(){
    this.AddCardBtn.setAttribute("style", "display:none"); //Скрываем кнопку, чтобы пользователь не мог бесконечно создавать формы
    this.cardList.push(new Card(this.divListContent, this));
  }

  createListForCards(){
    // Контейнер-колонка
    this.divCol = document.createElement('div');
    this.divCol.classList.add('col-my', 'col-3');

    //Заголовок колонки
    this.divHeader = document.createElement('div');
    this.divHeader.classList.add('col-header');

    //Кнопка для добавления карточки
    this.AddCardBtn = document.createElement('button');
    setAttributes(this.AddCardBtn, {"type": "button", "aria-label": "Добавить новую карточку", "aria-expanded": "false"});
    this.AddCardBtn.classList.add('button-new-card');
    this.AddCardBtn.addEventListener('click', ()=>{
      console.log("Была нажата addCardBtn");
      this.addCardFormFunc();
    })
    this.AddCardBtn.innerHTML = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-plus">' +
                                      '<path fill-rule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>' +
                                  '</svg>';

    //Счётчик количества карточек в колонке
    this.numberOfCards = document.createElement('span');
    this.numberOfCards.classList.add('number-cards');
    this.numberOfCards.innerText = 0;

    //Кнопка удалить колонку
    this.DeleteColumnBtn = document.createElement('button');
    setAttributes(this.DeleteColumnBtn, {"type": "button"});
    this.DeleteColumnBtn.innerText = "Удалить столбец";
    this.DeleteColumnBtn.addEventListener('click', ()=>{
      console.log("Была нажата DeleteColumnBtn");
      this.divCol.remove();
    })

    //"Собираем" заголовок карточки
    this.divHeader.append(this.numberOfCards);
    this.divHeader.insertAdjacentHTML('beforeend',  '<h3 class="name-column"><span>' + this.title + '</span></h3>' +
                                                  '<details class="column-menu">' +
                                                      '<summary class="column-menu" aria-label="Column menu" aria-haspopup="menu" role="button">' +
                                                        '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-kebab-horizontal">' +
                                                            '<path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>' +
                                                          '</svg>' +
                                                      '</summary>' +
                                                      '<div class="open"></div>' +
                                                  '</details>');
    this.divHeader.childNodes[2].childNodes[1].appendChild(this.DeleteColumnBtn); //Помещаем кнопку в <div class="open"></div>
    this.divHeader.append(this.AddCardBtn);

    //Контейнер в колонке, который содержит текст карточки
    this.divListContent = document.createElement('div');
    this.divListContent.classList.add('col-content');

    //Дособираем итоговую колонку
    this.divCol.append(this.divHeader);
    this.divCol.append(this.divListContent);
  }
}

//Класс, описывающий карточку
class Card{
  constructor(place, listForCards){ //listForCards передаём, чтобы увеличивать/уменшать счётчик карточек в колонке
    this.place = place;
    this.listForCards = listForCards;

    //Здесь хранится содержание карточки
    this.cardEntity = {
      title: "",
      description: "Click to write a description...",
      comments: []
    }

    this.render();
  }

  render(){
    this.createCardFormElement(); //Создаём форму для заполнения карточки
  }

  createCardFormElement(){
    //Создаём контейнер для формы заполнения карточки
    this.formCard = document.createElement('div');
    setAttributes(this.formCard, {"class": "form", "accept-charset": "UTF-8"});

    this.inputContentType = document.createElement('input');
    setAttributes(this.inputContentType, {"type": "hidden", "name": "content_type", "value": "Note"});

    this.inputClientUid = document.createElement('input');
    setAttributes(this.inputClientUid, {"type": "hidden", "name": "client_uid", "value": "75de466ef3aa261df45a6fddefb6c289"});

    //Поле ввода текста для формы
    this.textAreaOfCardForm = document.createElement('textarea');
    setAttributes(this.textAreaOfCardForm, {"name":"note", "required":"", "autofocus":"", "aria-label":"Введите заметку", "class":"form-control input-block js-quick-submit js-size-to-fit js-note-text js-length-limited-input",
      "data-input-max-length":"256", "data-warning-length":"99", "data-warning-text":"{{remaining}} remaining", "placeholder":"Введите заметку", "spellcheck":"false"});

    //Контейнер для кнопок
    this.divContainerForBtn = document.createElement('div');
    this.divContainerForBtn.classList.add('flex');

    //Потвердить создание карточки
    this.submitCardBtn = document.createElement('button');
    setAttributes(this.submitCardBtn, {"type":"submit", "class":"btn"});
    this.submitCardBtn.innerText = "Добавить";
    this.submitCardBtn.addEventListener('click', ()=>{
      console.log("Была нажата кнопка потверждения создания карточки");
      this.listForCards.numberOfCards.innerText = Number(this.listForCards.numberOfCards.innerText) + 1;
      this.createCardElement();
    })

    //Отменить создание карточки
    this.deleteCardForm = document.createElement('button');
    setAttributes(this.deleteCardForm, {"type":"button", "class":"btn"});
    this.deleteCardForm.innerText = "Отмена";
    this.deleteCardForm.addEventListener('click', ()=>{
      console.log("Была нажата кнопка отмены создания карточки");
      this.formCard.remove(); //Убираем форму
      this.listForCards.AddCardBtn.setAttribute("style", "display:inline"); //Возвращаем кнопку
    })

    //Теперь собираем все компоненты воедино
    this.divContainerForBtn.append(this.submitCardBtn, this.deleteCardForm);
    this.formCard.append(this.inputContentType, this.inputClientUid, this.textAreaOfCardForm, this.divContainerForBtn);

    this.place.append(this.formCard);
  }

  createCardElement(){
    //Контейнер для карточки
    this.card = document.createElement('div');
    this.card.classList.add('card');
    this.card.addEventListener('click', ()=>{
      console.log("Была открыта карточка");
      this.showCard(); //Открываем карточку
    })

    //Название карточки
    this.cardName = document.createElement('div');
    this.cardName.innerText = this.textAreaOfCardForm.value;
    this.cardEntity.title = this.textAreaOfCardForm.value;

    //Кнопка удалить карточку
    this.DeleteCardBtn = document.createElement('button');
    this.DeleteCardBtn.innerText = "X";
    this.DeleteCardBtn.addEventListener('click', (e)=>{
      e.stopPropagation(); //Убираем открытие карточки, при нажатии на кнопку внутри карточки
      this.listForCards.numberOfCards.innerText = Number(this.listForCards.numberOfCards.innerText) - 1;
      this.card.remove();
      let i = this.listForCards.cardList.indexOf(this);
      this.listForCards.cardList.splice(i,1);
      console.log("Была удалена карточка");
    });

    //Собираем объекты
    this.card.innerHTML = '<span class="card-svg">' +
                            '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-note">' +
                              '<path fill-rule="evenodd" d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5zm1.75-.25a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H1.75zM3.5 6.25a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z"></path>' +
                            '</svg>' +
                          '</span>' +
                          '<div class="card-content">' + this.cardName.innerText + '</div>' +
                          '<small class="add-info color-fg-muted">Добавлено<a class="color-text-primary" href="#" draggable="false">Josen190</a></small>';
    this.card.append(this.DeleteCardBtn)

    this.formCard.remove(); //Удаляем форму для создания карточки
    this.place.append(this.card); //Вместно неё добавляем обычную карточку
    this.listForCards.AddCardBtn.setAttribute("style", "display:inline"); //Возвращаем кнопку для создания следующей карточки
  }

  showCard(){
    //Задний фон страницы (затемнение страницы)
    this.cardPageContainer = document.createElement('div');
    this.cardPageContainer.classList.add('card-page-container');
    //Закрываем окно карточки, если пользователь нажал за границей окна карточки
    this.cardPageContainer.addEventListener('click', (e)=>{
      if(e.target.classList.contains("card-page-container")){
        this.cardPageContainer.remove();
      }
    })

    //Окно карточки
    this.cardPageMenu = document.createElement('div');
    this.cardPageMenu.classList.add('card-page-menu');

    //Название карточки
    this.cardTitle = document.createElement('div');
    this.cardTitle.classList.add('cardTitle');
    this.cardTitle.innerText = this.cardEntity.title;

    //Содержание карточки
    this.cardDescription = document.createElement('textarea');
    this.cardDescription.classList.add('cardDescription');
    this.cardDescription.value = this.cardEntity.description;

    //Кнопка для сохранения содержания карточки
    this.saveContentOfCardBtn = document.createElement('button');
    this.saveContentOfCardBtn.classList.add('saveContentBtn');
    this.saveContentOfCardBtn.innerHTML = "Сохранить";
    this.saveContentOfCardBtn.addEventListener('click', ()=>{
      this.cardEntity.description = this.cardDescription.value;
      this.cardPageContainer.remove();
    })

    //Контейнер для коментариев
    this.commentContainer = document.createElement('div');
    this.commentContainer.classList.add('comment-container');
    //Контейнер для ввода коментария
    this.commentInput = document.createElement('input');
    this.commentInput.classList.add('commentsInput');

    //Кнопка для сохранения коментария
    this.saveCommentBtn = document.createElement('button');
    this.saveCommentBtn.classList.add('saveContentBtn');
    this.saveCommentBtn.innerHTML = "Сохранить коментарий";
    this.saveCommentBtn.addEventListener('click', ()=>{
      if (this.commentInput.value != ""){
        this.cardEntity.comments.push(this.commentInput.value);
        this.commentInput.value = "";
        this.renderComments();
      }
    })

    //Собираем карточку
    this.renderComments();

    this.cardPageMenu.append(this.cardTitle, this.cardDescription, this.saveContentOfCardBtn, this.saveCommentBtn, this.commentInput,
      this.commentContainer);
    this.cardPageContainer.append(this.cardPageMenu);

    //Выводим карточку на экран
    document.getElementById('bodyId').append(this.cardPageContainer);
  }

  renderComments(){
    let currentCommentsDOM = Array.from(this.commentContainer.childNodes);

      currentCommentsDOM.forEach(commentDOM =>{
        commentDOM.remove();
      });

    this.cardEntity.comments.forEach(comment =>{
      new Comment(comment, this.commentContainer, this.cardEntity.comments);
    });
  }
}

class Comment{
    constructor(text, place, listOfComments){
        this.text = text;
        this.place = place;
        this.listOfComments = listOfComments;

        this.render();
    }

    render(){
        this.div = document.createElement('div');
        this.div.className = "comment";
        this.div.innerText = this.text;

        //Кнопка для удаления комментария
        this.DeleteCommentBtn = document.createElement('button');
        this.DeleteCommentBtn.innerText = "X";
        this.DeleteCommentBtn.addEventListener('click', (e)=>{
          this.div.remove();
          let i = this.listOfComments.indexOf(this);
          this.listOfComments.splice(i,1);
        });
        this.div.append(this.DeleteCommentBtn);

        this.place.append(this.div);
    }
}
