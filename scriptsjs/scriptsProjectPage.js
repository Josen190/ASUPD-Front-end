let o = new Intl.DateTimeFormat("ru" , {
  timeStyle: "medium",
  dateStyle: "short",
  formatMatcher: "best fit"
});

var dictOfStatus = {
  "IN_PROCESS" : "В процессе",
  "FROZEN": "Приостановлен",
  "DONE": "Завершён",
  "ACCEPTED": "зачтено",
  "DENIED": "не зачтено",
  "CHECK_REQUIRED": "На проверке",
  "DONE": "Выполнено"
}

function SaveStatusFunction() {
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
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

//  логика класов HTML
function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(id, cls) {
  ele = document.getElementById(id);
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(id, cls) {
  ele = document.getElementById(id);
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

document.querySelector('#nameOfProject').addEventListener('change', (e) => {
  console.log('Было изменено название проекта');
  EditProject(sessionStorage.getItem('tokenOfProject'), document.querySelector('#nameOfProject').value, 'IN_PROCESS');
});

let addColumnBtn = document.getElementById("createColumn");

async function LoadStageAndCardsFromDB(tokenOfStage) {
  var stageParams = await GetStage(tokenOfStage);
  var stageEntity = new StageForCards(stageParams['name'], stageParams['id']);
  for (var i = 0; i < Object.keys(stageParams['cardUuidList']).length; i++) {
    var cardParams = await GetCard(stageParams['cardUuidList'][i]);
    await stageEntity.pushCardToStage(stageParams['cardUuidList'][i], cardParams);
    var k = 2;
  }
  stageEntity.render();
}

addColumnBtn.addEventListener('click', async () => {
  console.log("Была нажата addColumnBtn");
  var nameOfStage = document.querySelector('#nameColum').value;
  let uuidOfStage = await AddStage(nameOfStage);

  if (nameOfStage == '') nameOfStage = 'Новый этап';
  var stageEntity = new StageForCards(nameOfStage, uuidOfStage);
  stageEntity.render();
});

//Логика этапов. Определяем место, куда будем помещать этапы
let root = document.getElementById("addColumn");

class StageForCards {
  constructor(title, tokenOfStage) {
    if (title.value == "") title.value = "Новый этап";

    this.stageEntity = {
      title: title,
      uuidOfStage: tokenOfStage,
      cardList: []
    }
  }

  pushCardToStage(tokenOfCard, cardParams) {
    var card = new Card();
    card.init(tokenOfCard, cardParams);
    this.stageEntity.cardList.push(card);
  }

  render() {
    this.createStageForCards();
    for (var i = 0; i < this.stageEntity.cardList.length; i++) {
      this.stageEntity.cardList[i].render(this);
    }
  }
  createStageForCards() {
    // Контейнер-этапа
    this.divStage = document.createElement('div');
    this.divStage.classList.add('col-my', 'col-3');
    this.divStage.dataset.uuidOfStage = this.stageEntity.uuidOfStage;

    //Заголовок этапа
    this.divHeader = document.createElement('div');
    this.divHeader.classList.add('col-header');

    //Кнопка для добавления карточки
    this.AddCardBtn = document.createElement('button');
    setAttributes(this.AddCardBtn, { "type": "button", "aria-label": "Добавить новую карточку", "aria-expanded": "false" });
    this.AddCardBtn.classList.add('button-new-card');
    this.AddCardBtn.addEventListener('click', async (e) => {
      console.log("Была нажата addCardBtn");
      this.AddCardBtn.setAttribute("style", "display:none"); 

      var card = new Card();
      card.createCardInputFormElement(this);
    })
    this.AddCardBtn.innerHTML = '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-plus">' +
      '<path fill-rule="evenodd" d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"></path>' +
      '</svg>';

    //Счётчик количества карточек в этапе
    this.numberOfCards = document.createElement('span');
    this.numberOfCards.classList.add('number-cards');
    this.numberOfCards.innerText = 0;

    //Кнопка удалить этап
    this.DeleteColumnBtn = document.createElement('button');
    setAttributes(this.DeleteColumnBtn, { "type": "button" });
    this.DeleteColumnBtn.innerText = "Удалить этап";
    this.DeleteColumnBtn.addEventListener('click', async () => {
      await DeleteStage(this.stageEntity.uuidOfStage, sessionStorage.getItem('tokenOfProject'));
      console.log("Была нажата DeleteColumnBtn");
      this.divStage.remove();
    })

    //"Собираем" заголовок карточки
    this.divHeader.append(this.numberOfCards);
    this.divHeader.insertAdjacentHTML('beforeend', '<h3 class="name-column"><span>' + this.stageEntity.title + '</span></h3>' +
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

    //Контейнер в этапе, который содержит текст карточки
    this.divStageContent = document.createElement('div');
    this.divStageContent.classList.add('col-content');

    //Дособираем итоговый этап
    this.divStage.append(this.divHeader);
    this.divStage.append(this.divStageContent);

    root.before(this.divStage);
  }
}

//Класс, описывающий карточку
class Card {
  constructor() { //listForCards передаём, чтобы увеличивать/уменшать счётчик карточек в этапе
    // var today = new Date();
    // var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //Здесь хранится информация о карточке
    this.cardEntity = {
      id: "",
      title: "",
      status: "",
      description: "",
      commentList: [],
      lastChangeDate: null,
      mark: ""
    }
  }

  init(tokenOfCard, cardParams) {
    this.cardEntity = {
      id: tokenOfCard,
      title: cardParams["name"],
      status: cardParams["status"],
      description: cardParams["content"],
      commentList: cardParams["commentUuidList"],
      lastChangeDate: cardParams["lastModifiedDate"],
      mark: cardParams["mark"]
    }
  }

  render(stageInstance) {
    this.createCardElement(stageInstance);
  }

  createCardElement(stageInstance) {
    //Контейнер для карточки
    this.card = document.createElement('div');
    this.card.classList.add('card');
    this.card.addEventListener('click', () => {
      console.log("Была открыта карточка");
      this.showCard(stageInstance); //Открываем карточку
    })

    //Название карточки
    this.cardName = document.createElement('div');
    this.cardName.innerText = this.cardEntity.title + "|" + this.cardEntity.id;

    //Кнопка удалить карточку
    this.DeleteCardBtn = document.createElement('button');
    this.DeleteCardBtn.classList.add('button');
    this.DeleteCardBtn.innerText = "x";
    this.DeleteCardBtn.addEventListener('click', async (e) => {
      e.stopPropagation(); //Убираем открытие карточки, при нажатии на кнопку внутри карточки
      stageInstance.numberOfCards.innerText = Number(stageInstance.numberOfCards.innerText) - 1;
      this.card.remove();
      DeleteCard(this.cardEntity.id);
      let i = stageInstance.stageEntity.cardList.indexOf(this);
      stageInstance.stageEntity.cardList.splice(i, 1);
      console.log("Была удалена карточка");
    });

    //Собираем объекты
    this.card.insertAdjacentHTML('beforeend',
      '<span class="card-svg">' +
      '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-note">' +
      '<path fill-rule="evenodd" d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5zm1.75-.25a.25.25 0 00-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25v-8.5a.25.25 0 00-.25-.25H1.75zM3.5 6.25a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z"></path>' +
      '</svg>' +
      '</span>' +
      '<span class="card-content">' + this.cardName.innerText + '</span>' +
      '<small class="add-info color-fg-muted">Добавлено<a class="color-text-primary" href="#" draggable="false">Josen190</a></small>');
    this.btnWrapper = document.createElement('div');
    this.btnWrapper.classList.add('button-wrapper');
    this.btnWrapper.append(this.DeleteCardBtn);
    this.card.append(this.btnWrapper);

    stageInstance.divStageContent.append(this.card); //Вместно неё добавляем обычную карточку
  }

  createCardInputFormElement(stageInstance) {
    //Создаём контейнер для формы заполнения карточки
    this.formCard = document.createElement('div');
    setAttributes(this.formCard, { "class": "form", "accept-charset": "UTF-8" });

    this.inputContentType = document.createElement('input');
    setAttributes(this.inputContentType, { "type": "hidden", "name": "content_type", "value": "Note" });

    this.inputClientUid = document.createElement('input');
    setAttributes(this.inputClientUid, { "type": "hidden", "name": "client_uid" });

    //Поле ввода текста для формы
    this.textAreaOfCardForm = document.createElement('textarea');
    setAttributes(this.textAreaOfCardForm, {
      "name": "note", "required": "", "autofocus": "", "aria-label": "Название задачи", "class": "form-control input-block js-quick-submit js-size-to-fit js-note-text js-length-limited-input",
      "data-input-max-length": "256", "data-warning-length": "99", "data-warning-text": "{{remaining}} remaining", "placeholder": "Название задачи", "spellcheck": "false"
    });

    //Контейнер для кнопок
    this.divContainerForBtn = document.createElement('div');
    this.divContainerForBtn.classList.add('flex');

    //Потвердить создание карточки
    this.submitCardBtn = document.createElement('button');
    setAttributes(this.submitCardBtn, { "type": "submit", "class": "btn" });
    this.submitCardBtn.innerText = "Добавить";
    this.submitCardBtn.addEventListener('click', async (e) => {
      if (!e.detail || e.detail == 1) {
        console.log("Была нажата кнопка потверждения создания карточки");
        stageInstance.numberOfCards.innerText = Number(stageInstance.numberOfCards.innerText) + 1;

        var tokenOfCard = await AddCard(stageInstance.stageEntity.uuidOfStage, this.textAreaOfCardForm.value, '');
        if (this.textAreaOfCardForm.value == "") this.textAreaOfCardForm.value = "Новая карточка";
        var cardParams = {
          id: tokenOfCard,
          name: this.textAreaOfCardForm.value,
          status: "IN_PROCESS",
          content: "",
          commentUuidList: [],
          lastModifiedDate: new Date(),
          lastModifiedUserName: sessionStorage.getItem('token'),
          mark: ""
        };
        this.init(tokenOfCard, cardParams);
        this.createCardElement(stageInstance);
        this.formCard.remove();
        stageInstance.AddCardBtn.setAttribute("style", "display:inline"); //Возвращаем кнопку
      }
    })

    //Отменить создание карточки
    this.deleteCardForm = document.createElement('button');
    setAttributes(this.deleteCardForm, { "type": "button", "class": "btn" });
    this.deleteCardForm.innerText = "Отмена";
    this.deleteCardForm.addEventListener('click', () => {
      console.log("Была нажата кнопка отмены создания карточки");
      this.formCard.remove(); //Убираем форму
      stageInstance.AddCardBtn.setAttribute("style", "display:inline"); //Возвращаем кнопку
    })

    //Теперь собираем все компоненты воедино
    this.divContainerForBtn.append(this.submitCardBtn, this.deleteCardForm);
    this.formCard.append(this.inputContentType, this.inputClientUid, this.textAreaOfCardForm, this.divContainerForBtn);

    stageInstance.divStageContent.insertBefore(this.formCard, stageInstance.divStageContent.firstChild);
  }

  //Окно, вызываемое при отркытии карточки
  showCard(stageInstance) {
    //Затемнённая область позади карточки
    this.divCardContainer = document.createElement('div');
    this.divCardContainer.classList.add('card-wrapper');
    //Будем закрывать карточку, если нажимаем на затемнённую область
    this.divCardContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains("card-wrapper")) {
        this.divCardContainer.remove();
      }
    })

    //Контейнер, содержащий все элементы карточки
    this.divCard = document.createElement('div');
    setAttributes(this.divCard, { "class": "form-card" });

    //Кнопка, чтобы закрыть карточку
    this.closeCardBtn = document.createElement('div');
    this.closeCardBtn.classList.add('close');
    this.closeCardBtn.innerHTML = '<button type="button" name="close" class="button">x</button>';
    this.closeCardBtn.addEventListener('click', () => {
      this.divCardContainer.remove();
    });

    //Заголовок карточки
    //================================================================================================//
    this.divHeader = document.createElement('div');
    this.divHeader.classList.add('header');
    this.divHeader.insertAdjacentHTML('beforeend',
      '<div class="info">' +
      '<h3 id = "nameCard" class="name">' + this.cardEntity.title + '|' + this.cardEntity.id + '</h3>' +
      '<p id = "statusOfCard">' + dictOfStatus[this.cardEntity.status] + '</p>' +
      '</div>');
    this.divHeader.append(this.closeCardBtn);    

    this.divHeader.insertAdjacentHTML('beforeend',
      '<div class="last-change">' +      
      '<p id = "lastData">Последнее изменение: ' + o.format(Date.parse(this.cardEntity.lastChangeDate)) + '</p>' +
      '<p id = "lastUser">Изменил: ' + sessionStorage.getItem('fullName') + '</p>' +
      '</div>');
    //================================================================================================//


    //Содержимое карточки
    //================================================================================================//
    this.divContent = document.createElement('div');
    this.divContent.classList.add('content');
    //Контейнер для кнопок Содержание и Изменить
    this.btnContainer = document.createElement('div');
    this.btnContainer.classList.add('mode');
    //Кнопка "Содержание"
    this.ContentBtn = document.createElement('button');
    setAttributes(this.ContentBtn, { "id": "viewingCardContents", "type": "button", "name": "viewing", "disabled": "true" });
    this.ContentBtn.innerText = "Содержание";
    this.ContentBtn.addEventListener('click', () => {
      console.log("Содержание");
      this.ContentBtn.parentNode.childNodes[0].setAttribute("disabled", "true");
      this.ContentBtn.parentNode.childNodes[1].removeAttribute('disabled');
      this.ContentBtn.parentNode.parentNode.childNodes[1].childNodes[0].setAttribute("disabled", "true");
    });
    //Кнопка "Изменить"
    this.ChangeContentBtn = document.createElement('button');
    setAttributes(this.ChangeContentBtn, { "id": "changeCardContents", "type": "button", "name": "change" });
    this.ChangeContentBtn.innerText = "Изменить";
    this.ChangeContentBtn.addEventListener('click', () => {
      console.log("Изменить");
      this.ChangeContentBtn.parentNode.childNodes[0].removeAttribute('disabled');
      this.ChangeContentBtn.parentNode.childNodes[1].setAttribute("disabled", "true");
      this.ChangeContentBtn.parentNode.nextSibling.childNodes[0].removeAttribute('disabled');
    });
    //Контейнер для текстового поля
    this.divTextContainer = document.createElement('div');
    setAttributes(this.divTextContainer, { "class": "filling", "placeholder": "Введите содержание карточки" });
    this.divTextContainer.classList.add('filling');
    //Текстовое поле
    this.textAreaForCard = document.createElement('textarea');
    this.textAreaForCard.setAttribute('disabled', 'true');
    this.textAreaForCard.value = this.cardEntity.description;
    this.textAreaForCard.addEventListener('change', async (e) => {
      this.cardEntity.description = this.textAreaForCard.value;      
      this.ContentBtn.click();
      await EditCard(this.cardEntity.id, this.cardEntity.title, this.cardEntity.status, this.cardEntity.description, this.cardEntity.mark);
    });
    //Собираем эту часть карточки
    this.btnContainer.append(this.ContentBtn, this.ChangeContentBtn);
    this.divTextContainer.append(this.textAreaForCard);
    this.divContent.append(this.btnContainer, this.divTextContainer);
    //================================================================================================//


    //Боковые кнопки
    //================================================================================================//
    //Контейнер для кнопок
    this.actionsBtns = document.createElement('div');
    this.actionsBtns.classList.add('actions');
    this.actionsBtns.insertAdjacentHTML('beforeend', '<h4>Действия</h4>');
    //Кнопки
    this.estimateBtn = document.createElement('button');
    setAttributes(this.estimateBtn, { "type": "button", "name": "estimate"});
    this.estimateBtn.innerText = "Зачесть задание";
    // this.estimateBtn.addEventListener('click', () => {
    //   //Создадим модальное окно
    //   // this.estimateWindow = document.createElement('div');
    //   // setAttributes(this.estimateWindow, { "class": "pop-outer", "id": "estimateWindow" })
    //   // this.estimateWindow.insertAdjacentHTML('beforeend',
    //   //   '<div class="form-estimate">' +
    //   //   '<div class="header">' +
    //   //   '<h3>Оценить карточку</h3>' +
    //   //   '</div>' +
    //   //   '<div class="estimate">' +
    //   //   '<input id="inputMark" type="text" name="" placeholder="Оценка">' +
    //   //   '<button id="buttonSaveMark" type="button" name="button">Сохранить</button>' +
    //   //   '</div>' +
    //   //   '</div>');
    //   this.estimateWindow.addEventListener('click', (e) => {
    //     e.stopPropagation();
    //     if (e.target.id == "estimateWindow") {
    //       this.estimateWindow.remove();
    //     }
    //   })
    //   //Кнопка "Сохранить"
    //   this.estimateWindow.querySelector('#buttonSaveMark').addEventListener('click', () => {
    //     this.estimateWindow.remove();

    //     this.cardEntity.mark = String(this.estimateWindow.querySelector('#inputMark').value);
    //     this.markDiv.innerText = "Оценка: " + String(this.estimateWindow.querySelector('#inputMark').value);
    //   })

    //   document.getElementById('showCardContaier').append(this.estimateWindow);
    // })

    //Кнопка "Изменить статус"
    this.status = document.createElement('button');
    setAttributes(this.status, { "type": "button", "name": "status"});
    this.status.innerText = "Изменить статус";
    this.status.addEventListener('click', () => {
      this.statusWindowWrapper = document.createElement('div');
      setAttributes(this.statusWindowWrapper, { "class": "pop-outer", "id": "statusWindow" })
      this.statusWindowWrapper.insertAdjacentHTML('beforeend',
        '<div id = "form-status" class="form-status">' +
        '<div class="header">' +
        '<h3>Изменить статус</h3>' +
        '<button type="button" name="close" class="button">x</button>' +
        '</div>' +
        '<div class="status">' +
        '<div>' +
        '<input id="inProcess" type="radio" name="status" value="В процессе"> В процессе' +
        '</div>' +
        '<div>' +
        '<input id="Checking" type="radio" name="status" value="На проверке"> На проверке' +
        '</div>' +
        '<div>' +
        '<input id="Completed" type="radio" name="status" value="Завершён"> Завершён' +
        '</div>' +
        '</div>' +
        '</div>');

      this.statusWindowWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.id == "statusWindow") {
          this.statusWindowWrapper.remove();
        }
      })
      this.statusWindowWrapper.querySelector('.button').addEventListener('click', () => {
        this.statusWindowWrapper.remove();
      })
      this.statusWindowWrapper.querySelector('#inProcess').addEventListener('click', () => {
        this.divCard.querySelector('#statusOfCard').innerText = dictOfStatus['IN_PROCESS'];
        this.cardEntity.status = 'IN_PROCESS';
        EdirCard(this.cardEntity.id, this.cardEntity.title, this.cardEntity.status, this.cardEntity.description, this.cardEntity.mark);
      });
      this.statusWindowWrapper.querySelector('#Checking').addEventListener('click', () => {
        this.divCard.querySelector('#statusOfCard').innerText = dictOfStatus['CHECK_REQUIRED'];
        this.cardEntity.status = 'CHECK_REQUIRED';
        EditCard(this.cardEntity.id, this.cardEntity.title, this.cardEntity.status, this.cardEntity.description, this.cardEntity.mark);
      });
      this.statusWindowWrapper.querySelector('#Completed').addEventListener('click', () => {
        this.divCard.querySelector('#statusOfCard').innerText = dictOfStatus['DONE'];
        this.cardEntity.status = 'DONE';
        EditCard(this.cardEntity.id, this.cardEntity.title, this.cardEntity.status, this.cardEntity.description, this.cardEntity.mark);
      });

      document.getElementById('showCardContaier').append(this.statusWindowWrapper);
    })

    this.delete = document.createElement('button');
    setAttributes(this.estimateBtn, { "type": "button", "name": "delete" });
    this.delete.innerText = "Удалить";
    this.delete.addEventListener('click', (e) => {
      this.card.remove();
      this.divCardContainer.remove();
      let i = this.listForCards.cardList.indexOf(this);
      stageInstance.cardList.splice(i, 1);
      console.log("Была удалена карточка");
    });

    //Оценка
    this.markDiv = document.createElement('div');
    this.markDiv.classList.add('mark-div');
    this.markDiv.innerText = "Оценка задачи: " + 'задание не проверено';

    //Собираем эту часть карточки
    this.actionsBtns.append(this.estimateBtn, this.status, this.delete, this.markDiv);
    //================================================================================================//

    //Коментарии
    //================================================================================================//
    // this.divComments = document.createElement('div');
    // this.divComments.classList.add('comments');
    // this.divComments.insertAdjacentHTML('beforeend', '<h5>Коментарии</h5>');
    // //Контейнер для ввода комментария
    // this.inputCommentContainer = document.createElement('div');
    // this.inputCommentContainer.classList.add('new');
    // //textarea для ввода коментария
    // this.textAreaComment = document.createElement('textarea');
    // setAttributes(this.textAreaComment, { "placeholder": "Новый комменатрий", "name": "comment", "rows": "3", "required": "true" });
    // //Кнопка "Сохранить комменатрий"
    // this.saveCommentBtn = document.createElement('button');
    // setAttributes(this.saveCommentBtn, { "type": "button", "name": "sendComment", "class": "btn" });
    // this.saveCommentBtn.innerText = "Сохранить";
    // this.saveCommentBtn.addEventListener('click', () => {
    //   if (this.textAreaComment.value != "") {
    //     var today = new Date();
    //     var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    //     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     this.cardEntity.commentList.push([this.textAreaComment.value, String(time + ' ' + date)]);
    //     console.log()
    //     this.textAreaComment.value = "";
    //     this.renderComments();
    //   }
    // })
    // //Контейнер для старых комментариев
    // this.oldCommentsContainer = document.createElement('div');
    // setAttributes(this.oldCommentsContainer, { "class": "old", "id": "commentList" });

    // this.renderComments();
    // //Собираем данный элемент карточки
    // this.inputCommentContainer.append(this.textAreaComment, this.saveCommentBtn, this.oldCommentsContainer);
    // this.divComments.append(this.inputCommentContainer);
    //================================================================================================//

    //Собираем карточку
    this.divCard.append(this.divHeader, this.divContent, this.actionsBtns);
    this.divCardContainer.append(this.divCard);
    document.getElementById('showCardContaier').append(this.divCardContainer);
  }

  // renderComments() {
  //   let currentCommentsDOM = Array.from(this.oldCommentsContainer.childNodes);

  //   currentCommentsDOM.forEach(commentDOM => {
  //     commentDOM.remove();
  //   });

  //   this.cardEntity.commentList.forEach(comment => {
  //     new Comment(comment, this.oldCommentsContainer);
  //   });
  // }
}

// class Comment {
//   constructor(comment, place) {
//     this.place = place;
//     this.comment = comment[0];
//     this.date = comment[1];

//     this.render();
//   }

//   render() {
//     this.div = document.createElement('div');
//     this.div.className = "elem-comment";
//     this.div.insertAdjacentHTML('beforeend',
//       '<div class="info-comment">' +
//       '<a id = "userCommen">User</a>' +
//       '<data id = "dataComment">' + this.date + '</data>' +
//       '</div>' +
//       '<div class="content-comment">' +
//       '<p id = "contentComment" >' + this.comment + '</p>' +
//       '</div>')
//     this.place.append(this.div);
//   }
// }