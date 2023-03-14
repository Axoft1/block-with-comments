let formName = document.querySelector(".form-name");
let formMessage = document.querySelector(".form-message");
let formDate = document.querySelector(".form-date");
let addBtn = document.querySelector(".form-addBtn");
let blockComments = document.querySelector(".blockComments");
let blockCommentsBtn = document.querySelector(".blockComments__btn");
let container = document.querySelector(".comments-list");

let commentsList = [];
console.log(commentsList);
// Проверка localStorage
if (localStorage.getItem("comments")) {
  commentsList = JSON.parse(localStorage.getItem("comments"));
  createComment();
}

// Добавляет событи click на кнопку
addBtn.addEventListener("click", (e) => {
  addComment(e);
});

/**
 * Формирует объект коментария
 *
 * @param {Object} e событие
 * @return {Object} commentsList
 * делает запись в localStorage, очищает форму
 */
function addComment(e) {
  // создает переменные для объекта newMessage
  let today = new Date();
  let todayId = new Date().getMilliseconds();
  let hh = String(today.getHours()).padStart(2, "0");
  let mi = String(today.getMinutes()).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let yesterday = `${yyyy}-${mm}-${dd - 1}`;
  let time = `${hh}:${mi}`;
  today = `${yyyy}-${mm}-${dd}`;

  let newMessage = {
    id: todayId,
    name: formName.value,
    text: formMessage.value,
    date: formDate.value || today,
    time: time,
    yesterday: yesterday == formDate.value,
    like: false,
  };

  // Проводит проверку пустые ли строки в форме
  if (formMessage.value.length > 0 && formName.value.length > 0) {
    e.preventDefault();
    commentsList.push(newMessage);
    createComment();
    localStorage.setItem("comments", JSON.stringify(commentsList));
    formName.value = "";
    formMessage.value = "";
    formDate.value = "";
  }
}

/**
 * Создает html разметку с введенными данными и добавляет в DOM
 */
function createComment() {
  let newcreateComment = "";

  commentsList.forEach((measege) => {
    measege.id;
    newcreateComment += `
      <div id=${measege.id} class="comment-item">
        <div class="comment-item__header">
          <div class="comment-item__header-name">
            <h3>
              <img src="./img/user.svg"/> 
              ${measege.name}
            </h3>
          </div>
          <div class="comment-item__header-date">
            <p>
             ${measege.date}           
              ${
                measege.yesterday
                  ? `вчера в ${measege.time}`
                  : `сегодня в ${measege.time}`
              }
            </p>          
          </div>
        </div>          
        <div class="comment-item__body">
          <p>
            ${measege.text}
          </p>  
        </div>        
              <svg class="comment-item__svg  ${
                measege.like ? "disLike" : "like"
              }" width="30px" height="30px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" 
               d="M15.9 4.5C15.9 3 14.418 2 13.26 2c-.806 0-.869.612-.993 1.82-.055.53-.121 1.174-.267 1.93-.386 2.002-1.72 4.56-2.996 5.325V17C9 19.25 9.75 20 13 20h3.773c2.176 0 2.703-1.433 2.899-1.964l.013-.036c.114-.306.358-.547.638-.82.31-.306.664-.653.927-1.18.311-.623.27-1.177.233-1.67-.023-.299-.044-.575.017-.83.064-.27.146-.475.225-.671.143-.356.275-.686.275-1.329 0-1.5-.748-2.498-2.315-2.498H15.5S15.9 6 15.9 4.5zM5.5 10A1.5 1.5 0 0 0 4 11.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 5.5 10z"/></svg>
     
        <img class="comment-item__btn" src="./img/basket.svg"/>
      </div>
    `;
  });
  blockComments.innerHTML = newcreateComment;
  if (commentsList.length === 0) {
    blockComments.innerHTML = '<div class="comment-item">Нет коментариев</div>';
  }
}

/**
 * Отслеживает событие onclick
 *
 * @param {Object} event Событие
 * @returns записывает в localStorage и вызывает createComment()
 */
container.onclick = function (event) {
  if (event.target.parentElement.classList[0] == "comment-item__svg") {
    let el = event.target.parentElement;
    let newEl = el.parentElement.id;
    let i = commentsList.findIndex((obj) => obj.id == newEl);
    if (commentsList[i].like == false) {
      commentsList[i].like = true;
    } else if (commentsList[i].like == true) {
      commentsList[i].like = false;
    }
  }
  if (event.target.className == "comment-item__btn") {
    commentsList = commentsList.filter((e) => {
      return e.id !== +event.target.parentElement.id;
    });
  }
  createComment();
  localStorage.setItem("comments", JSON.stringify(commentsList));
};

/**
 * Отслеживает событие клавиши Enter
 *
 * @param {Object} event Событие
 * @returns вызывает addComment
 */
formMessage.addEventListener("keydown", submitOnEnter);
function submitOnEnter(event) {
  if (event.which === 13) {
    if (!event.repeat) {
      const newEvent = new PointerEvent("submit", { cancelable: true });
      addComment(newEvent);
    }

    event.preventDefault(); // Prevents the addition of a new line in the text field
  }
}

/**
 * Ставит фокус на name
 * устанавливает ограничения календаря
 */
(function () {
  formName.focus();
  let now = new Date();
  let dd = String(now.getDate()).padStart(2, "0");
  let mm = String(now.getMonth() + 1).padStart(2, "0");
  let yyyy = now.getFullYear();
  maxDate = `${yyyy}-${mm}-${dd}`;
  minDate = `${yyyy}-${mm}-${dd - 1}`;
  formDate.setAttribute("max", maxDate);
  formDate.setAttribute("min", minDate);
})();
