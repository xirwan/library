"use strict";

const showDialog = document.querySelector("#openModal");
const closeDialog = document.querySelector("#closeModal");
const dialog = document.querySelector("dialog");
const formBook = document.querySelector("#formBook");
const deleteAllButton = document.createElement("button");

class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read ? "Readed" : "Unread";
  }

  set title(value) {
    this._title = value;
  }

  set author(value) {
    this._author = value;
  }

  set pages(value) {
    this._pages = value;
  }

  set read(value) {
    this._read = value;
  }

  get read() {
    return this._read;
  }

  readBook(obj) {
    const bookId = obj.id;
    const targetBook = myLibrary.indexOf(
      myLibrary.find((item) => item.id === bookId)
    );
    myLibrary[targetBook].read =
      myLibrary[targetBook].read === "Readed" ? "Unread" : "Readed";
    localStorage.setItem("books", JSON.stringify(myLibrary));
    console.log("clicked");
    showBookOnTable();
  }
}

const myLibrary =
  localStorage.getItem("books") !== null
    ? JSON.parse(localStorage.getItem("books")).map((book) =>
        Object.assign(new Book(), book)
      )
    : [];

    
// object constructor function
// function Book(title, author, pages, read) {
//   this.id = crypto.randomUUID();
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.read = read ? "Readed" : "Unread";
// }

// Book.prototype.readBook = function (obj) {
//   const bookId = obj.id;
//   const targetBook = myLibrary.indexOf(
//     myLibrary.find((item) => item.id === bookId)
//   );
//   myLibrary[targetBook].read =
//     myLibrary[targetBook].read === "Readed" ? "Unread" : "Readed";
//   localStorage.setItem("books", JSON.stringify(myLibrary));
//   showBookOnTable();
// };

showDialog.addEventListener("click", () => {
  dialog.showModal();
});

closeDialog.addEventListener("click", () => {
  formBook.reset();
  dialog.close();
});

formBook.onsubmit = function (e) {
  e.preventDefault();
  const formData = new FormData(formBook);
  const dataObject = Object.fromEntries(formData);
  dataObject.status = dataObject.status === "true" ? true : false;
  addBookToLibrary(
    dataObject.title,
    dataObject.author,
    dataObject.pages,
    dataObject.status
  );
  localStorage.setItem("books", JSON.stringify(myLibrary));
  showBookOnTable();
  formBook.reset();
  dialog.close();
};

function addBookToLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
}

function showBookOnTable() {
  showDeleteAllButton();
  const tblBody = document.querySelector("tbody");
  const data = JSON.parse(localStorage.getItem("books")) || [];
  const dataBook =
    data.length !== 0
      ? data.map((book) => Object.assign(new Book(), book))
      : [];
  tblBody.innerHTML = "";
  dataBook.forEach((book, index) => {
    const row = document.createElement("tr");
    row.setAttribute("data-index", `${book.id}`);
    const cell = document.createElement("td");
    const cellText = document.createTextNode(`${index + 1}`);
    cell.appendChild(cellText);
    row.appendChild(cell);
    for (const [key, value] of Object.entries(book)) {
      if (key !== "id") {
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        const cell = document.createElement("td");
        const cellText = document.createTextNode(`${value}`);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
    }
    const cellButton = document.createElement("td");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    editButton.textContent = book.read === "Readed" ? "Unread" : "Read";
    deleteButton.classList.add("addButton");
    editButton.classList.add("addButton");
    deleteButton.addEventListener("click", deleteBook);
    editButton.addEventListener("click", () => {
      book.readBook(book);
    });
    cellButton.appendChild(deleteButton);
    cellButton.appendChild(editButton);
    row.appendChild(cellButton);
    tblBody.appendChild(row);
  });
}

function deleteBook() {
  let text = "Are you sure you want to delete this data?";
  if (confirm(text) == true) {
    const bookId = this.parentElement.parentElement.dataset.index;
    const targetBook = myLibrary.indexOf(
      myLibrary.find((item) => item.id === bookId)
    );
    myLibrary.splice(targetBook, 1);
    localStorage.setItem("books", JSON.stringify(myLibrary));
    showBookOnTable();
  }
}

function deleteAllBook() {
  let text = "Are you sure you want to delete all data?";
  if (confirm(text) == true) {
    myLibrary.length = 0;
    localStorage.clear();
    showBookOnTable();
  }
}

function showDeleteAllButton() {
  const data = JSON.parse(localStorage.getItem("books")) || [];
  if (data.length !== 0) {
    deleteAllButton.textContent = "Delete All";
    deleteAllButton.classList.add("addButton");
    const sibling = document.querySelector("#openModal");
    deleteAllButton.addEventListener("click", deleteAllBook);
    sibling.insertAdjacentElement("afterend", deleteAllButton);
  } else {
    deleteAllButton.remove();
  }
}

showBookOnTable();
