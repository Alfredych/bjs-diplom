"use strict";

const logoutBtn = new LogoutButton();

logoutBtn.action = function () {
  ApiConnector.logout((response) => {
    console.log(response);
    if (response.success) {
      location.reload();
    } else {
      alert(response.error);
    }
  });
}

function showUserProfile() {
  ApiConnector.current((response) => {
    console.log(response);
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      console.log(response.error);
      alert(response.error);
    }
  });
}

showUserProfile();

let ratesBoard = new RatesBoard();

function getRates() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
      console.log('Обновили курсы валют');
    } else {
      console.log(response.error);
    }
  });
}

getRates();
let delay = 60000;
let timerId = setInterval(getRates, delay);


const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function(data) {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      showUserProfile();   
      moneyManager.setMessage(true, 'Баланс пополнен');
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
}

moneyManager.conversionMoneyCallback = function(data) {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      showUserProfile();   
      moneyManager.setMessage(true, 'Успешная конвертация');
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
}

moneyManager.sendMoneyCallback = function(data) {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      showUserProfile();   
      moneyManager.setMessage(true, 'Успешный перевод');
    }
  })
}

function updateFavoritesTable(data) {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(data);
  moneyManager.updateUsersList(data);
}

const favoritesWidget = new FavoritesWidget();

function showFavorites() {
  ApiConnector.getFavorites((response) => {
    if (response.success) {
      updateFavoritesTable(response.data);
    } else {
      console.log(response.error);
    }
  });
}

showFavorites();

favoritesWidget.addUserCallback = function(userData) {
  ApiConnector.addUserToFavorites(userData, (response) => {
    if (response.success) {
      updateFavoritesTable(response.data);
      favoritesWidget.setMessage(true, 'Контакт успешно добавлен');
    } else {
      favoritesWidget.setMessage(false, response.error);
      console.log('Контакт не добавлен');
    }
  });
  console.log("Отправляемые данные:", userData);
}

favoritesWidget.removeUserCallback = function(userData) {
  ApiConnector.removeUserFromFavorites(userData, (response) => {
    if (response.success) {
      updateFavoritesTable(response.data);
      favoritesWidget.setMessage(true, 'Контакт успешно удален');
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  })
}