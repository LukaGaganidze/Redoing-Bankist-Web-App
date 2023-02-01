'use strict';

//  ACCOUNTS DATA

const account1 = {
  owner: 'Luka Gaganidze',
  movements: [100, 200, 500, -100, 5000, -300, 100, 10],
  interestRate: 1.2,
  pin: 1111,
};
const account2 = {
  owner: 'Salome Gaganidze',
  movements: [22, 333, 11, -1233, 22, -123, 2132, 2],
  interestRate: 1.5,
  pin: 2222,
};
const account3 = {
  owner: 'Demna Junior Lomidze',
  movements: [232, 12, 1232, -12, 12323, -213, 123, 2],
  interestRate: 1.2,
  pin: 3333,
};
const account4 = {
  owner: 'Dachi Senior Lomidze',
  movements: [200, -200, 340, -300, -20, 50, 400],
  interestRate: 0.7,
  pin: 4444,
};
const account5 = {
  owner: 'Tea Nefaridze',
  movements: [5, 56, 88678, -456, 45, -345, 4, 3455],
  interestRate: 1,
  pin: 5555,
};

// ALL ACCS
const accounts = [account1, account2, account3, account4, account5];

// ALL ELEMENTS
//
// (1) LABLES / (TEXTS)
const welcomeMessige = document.querySelector('.nav--p');
const curBallanceDate = document.querySelector('.date');
const totalAmount = document.querySelector('.total--amount');
const singleMovement = document.querySelector('.mov--type');
const movementTypeDep = document.querySelector('.deposit--num');
const movementTypeWithd = document.querySelector('.withdraw--num');
const movDate = document.querySelector('.deposit--date');
const movAmount = document.querySelector('.deposit--amount');

// SUMMARY LABLE
const moneyInSum = document.querySelector('.amount--in--money');
const moneyOutSum = document.querySelector('.amount--out--money');
const moneyInterestSum = document.querySelector('.amount--interest--money');

// TIME LEFT LABLE
const rimeRemainingP = document.querySelector('.time-remaning');
const exactMinsRemaining = document.querySelector('.mins--remaning');

// (2) INPUTS
//
// log in
const logIn = document.querySelector('.nav--form--id');
const password = document.querySelector('.nav--form--pass');

// tranfer to
const tranferTo = document.querySelector('.transfer--to');
const tranferAmount = document.querySelector('.amount');

// request loan
const loanRequestInput = document.querySelector('.loan--request--input');

// close acc
const userConfirmInput = document.querySelector('.confirm--user--input');
const pinConfirmInput = document.querySelector('.pin--input--acc');

//
//BUTTONS
const btnLogIn = document.querySelector('.nav--form--buttom');
const btnTransfer = document.querySelector('.transfer--buttom');
const btnLoan = document.querySelector('.request--buttom');
const btnClose = document.querySelector('.close--buttom');
const btnSort = document.querySelector('.sort');
const btnPopUp = document.querySelector('.popup--btn');

// CONTAINERS
const mainApp = document.querySelector('.main--container');
const allmovs = document.querySelector('.all--transactions');
const popupWindow = document.querySelector('.pop--up');
//
// DOM MANIPULATIONS

// Currency function

const currencyLocalFun = function (value) {
  const locale = navigator.language;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
//
// MOVEMENT DISPLAY
const movementsDisplay = function (movements, sorted = false) {
  allmovs.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a, b) => b - a) : movements;

  movs.forEach((el, i) => {
    const type = el > 0 ? 'deposit' : 'withdraw';
    const html = `
    <div class="stransaction--3--div deposit--flex">
     <div class="deposit--inner--flex">
      <p class="${type}--num mov--type">${i + 1} ${type}</p>
     </div>
      <p class="deposit--amount">${currencyLocalFun(el)} </p>
    </div>`;

    allmovs.insertAdjacentHTML('beforeend', html);
  });
};

//
// CALCULATE AND DISPALY ALL MOVEMENTS SUMMARY (top)
const clacDisplaymovements = function (acc) {
  acc.deposit = acc.movements.reduce((acc, cur) => acc + cur, 0);
  totalAmount.textContent = `${currencyLocalFun(acc.deposit)}`;
};

//
// CALCULATE SUMMARY (bot)
const calcSummary = function (acc) {
  const displayIn = acc.movements
    .filter(arr => arr > 0)
    .reduce((acc, cur) => acc + cur, 0);
  moneyInSum.textContent = `${currencyLocalFun(displayIn)}`;

  const displayout = acc.movements
    .filter(arr => arr < 0)
    .reduce((acc, cur) => acc + cur);
  moneyOutSum.textContent = `${currencyLocalFun(Math.abs(displayout))}`;

  const displayInterest = acc.movements
    .filter(el => el > 0)
    .map(el => (el * acc.interestRate) / 100)
    .filter(el => el > 1)
    .reduce((acc, cur) => acc + cur);
  moneyInterestSum.textContent = `${currencyLocalFun(
    Math.floor(displayInterest)
  )}`;
};

//
// UPDATE UI
const updateUi = function (acc) {
  movementsDisplay(acc.movements);
  // display ballance
  clacDisplaymovements(acc);
  // display summary
  calcSummary(acc);
};

//
// USERNAME MAKER
const usarnameMaker = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};

usarnameMaker(accounts);

//
// LOG IN FUNCTION
let currentAccount, timer;

btnLogIn.addEventListener('click', function (e) {
  e.preventDefault();

  // login
  currentAccount = accounts.find(acc => acc.username === logIn.value);

  // pin
  if (currentAccount?.pin === +password.value) {
    welcomeMessige.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    // login blur
    logIn.value = password.value = '';
    // opacity
    mainApp.style.opacity = 100;
    // display movements
  }

  const curDate = new Date();
  const locale = navigator.language;

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const labelDate = document.querySelector('.date');

  labelDate.textContent = Intl.DateTimeFormat(locale, options).format(curDate);

  // Timer
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();

  updateUi(currentAccount);
});

//
// TRANSFER FUNCTION
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const tranferToAnother = accounts.find(
    acc => acc.username === tranferTo.value
  );

  const amount = tranferAmount.value;
  console.log(tranferToAnother, amount);

  if (
    amount > 0 &&
    tranferToAnother &&
    currentAccount.deposit >= amount &&
    tranferToAnother.owner !== currentAccount.owner
  ) {
    currentAccount.movements.unshift(-amount);
    tranferToAnother.movements.unshift(amount);
  }

  //

  clearInterval(timer);
  timer = startLogoutTimer();

  updateUi(currentAccount);

  tranferTo.value = tranferAmount.value = '';
});

// loanRequestInput
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Math.floor(loanRequestInput.value);

  if (currentAccount.movements.some(mov => mov > loan * 0.1)) {
    currentAccount.movements.unshift(loan);
  } else {
    popupWindow.style.display = 'block';
  }
  setTimeout(() => {
    clearInterval(timer);
    timer = startLogoutTimer();

    updateUi(currentAccount);

    loanRequestInput.value = '';
  }, 3000);
});

//  loan denide
btnPopUp.addEventListener('click', function (e) {
  e.preventDefault();

  popupWindow.style.display = 'none';
});

//
// CLOSE ACC
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    userConfirmInput.value === currentAccount.username &&
    +pinConfirmInput.value === currentAccount.pin
  ) {
    const theOneToDelete = accounts.findIndex(
      acc => acc.username == currentAccount.username
    );
    accounts.splice(theOneToDelete, 1);
  }

  //welcome lable update
  welcomeMessige.textContent = `Log in to get started`;

  // opacity to 0
  mainApp.style.opacity = 0;

  // input clear
  userConfirmInput.value = currentAccount.value = '';
});

//
// SORT MOVEMENT

let sort = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  movementsDisplay(currentAccount.movements, !sort);
  sort = !sort;
});

//  practice
//
//
//
//
//
// create a  date

const startLogoutTimer = function () {
  const tick = function () {
    const min = Math.trunc(time / 60);
    const second = time % 60;
    // in each call print the remainig time to UI
    rimeRemainingP.textContent = `${min}:${second}`;
    //when time = 0

    if (time === 0) {
      clearInterval(timer);
      welcomeMessige.textContent = `Log in to get started`;
      mainApp.style.opacity = 0;
    }
    time--;
  };
  // set timer 2 minutes
  let time = 120;
  // call the timer event second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
