'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Murad Mastaliyev',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 3169,
};

const account2 = {
  owner: 'Cavad Mirzali',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 6931,
};

const account3 = {
  owner: 'Nizami Hajizada',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3131,
};

const account4 = {
  owner: 'Rufat Aliyev',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 6969,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);
/////////////////////////////////////////////////
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //Prevent form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //For loosing focus of field

    // displayMovements(currentAccount.movements);
    // calcDisplayBalance(currentAccount);
    // calcDisplaySummary(currentAccount);
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApplication.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr.slice()); //shallow copy of an array also can be done by spread operator ...

// console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);
// splice mutates OG array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
// revrers mutates array

const letters = arr.concat(arr2);
console.log(letters);

console.log(letters.join(' - '));

const arr = [23, 11, 64];
console.log(arr.at(0));
console.log(arr.slice(-1).at(0));
console.log(arr.at(-1));
console.log('Murad'.at(0));
console.log('Murad'.at(-1));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0)
    console.log(`Movement ${i + 1} You deposited: ${Math.abs(movement)}`);
  else console.log(`Movement ${i + 1} You withdrew: ${Math.abs(movement)}`);
}

movements.forEach(function (movement, index, array) {
  if (movement > 0)
    console.log(`Movement ${index + 1} You deposited: ${Math.abs(movement)}`);
  else if (movement < 0)
    console.log(`Movement ${index + 1} You withdrew: ${Math.abs(movement)}`);
});


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value} ${map}`);
});

const currenciesUnique = new Set(['usd', 'gpb', 'usd', 'eur', 'eur']);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value} ${map}`);
});


// Coding challenge #1

const dogsJulia = [9, 16, 6, 8, 3];
const dogsKate = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCopy = dogsJulia.slice();
  const dogsJuliaCorrect = dogsJuliaCopy.slice(1, -2);

  const dogs = [...dogsJuliaCorrect, ...dogsKate];

  dogs.forEach(function (dog, num) {
    const age = dog >= 3 ? `an adult, and is ${dog} years old` : 'still puppy';

    console.log(`Dog number ${num + 1} is ${age}`);
  });
};

checkDogs(dogsJulia, dogsKate);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

const movementsUsd = movements.map(function (mov) {
  return mov * euroToUsd;
});

console.log(movements, movementsUsd);

const movementsUsdFor = [];
for (const mov of movements) {
  movementsUsdFor.push(mov * euroToUsd);
}

console.log(movementsUsdFor);

const movementsUsdArr = movements.map(mov => mov * euroToUsd);

console.log(movementsUsdArr);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'}: ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const depositsArr = movements.filter(mov => mov > 0);
console.log(depositsArr);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

const balance = movements.reduce(
  (accumulator, current) => accumulator + current,
  0
);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

const maxMovement = movements.reduce((acc, cur) => {
  if (acc > cur) return acc;
  else return cur;
}, movements[0]);
console.log(maxMovement);


// Coding challenge #2

const calcAverageHumanAge = function (ages) {
  const humanAge = ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(humanAge);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * 1.1)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);

// Coding challenge #3
const calcAverageHumanAge2 = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, _, arr) => acc + age / arr.length, 0);

console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Cavad Mirzali');
console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Cavad Mirzali') {
    const account = acc;
    console.log(account);
  }
}


console.log(movements.includes(-130));

const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);

console.log(account4.movements.every(mov => mov > 0));

const deposit = mov => mov > 0;
console.log(movements.some(deposit));

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[1, [2, 3]], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));
// Flat method only flats 1 level deep by default nesting we can specify depth into () default 1

const accountMovements = accounts.map(acc => acc.movements);
const allMovements = accountMovements.flat();
console.log(allMovements);

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

const overallBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance2);

const overallBalance3 = accounts
  .flatMap(acc => acc.movements) // ! flatMap only goes 1 level deep
  .reduce((acc, mov) => acc + mov, 0);


const owners = ['Murad', 'Cavad', 'Nizami', 'Rufat'];
console.log(owners.sort()); //* mutates og array

console.log(movements.sort()); //!sort method does sorting by strings

movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
}); //*ascending sorting
console.log(movements);

movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
}); //*descending sorting
console.log(movements);

movements.sort((a, b) => a - b); //*ascending
movements.sort((a, b) => b - a); //*descending


const arr = [1, 2, 3, 4, 5, 6];
console.log(new Array([1, 2, 3, 4, 5, 6]));
const x = new Array(7);
console.log(x); //*creates new empty array with 7 empty elements
// console.log(x.fill(1)); // mutates array

x.fill(1, 3, 5);
console.log(x);
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );

  console.log(movementsUI.map(mov => Number(mov.textContent.replace('€', ''))));
});


const bankDepositsSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositsSum);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => (mov >= 1000 ? ++acc : acc), 0);
console.log(numDeposits1000);

let a = 10;
console.log(a++); //still returns old value but after result will be 11. Equals 10
console.log(a); //equals 11
console.log(++a); //immediatly shows result 12

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (acc, mov) => {
      // mov > 0 ? (acc.deposits += mov) : (acc.withdrawals += mov);
      acc[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'with', 'on', 'in'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};


// Coding challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const ownersEatTooMuch = [];
const ownersEatTooLittle = [];
const ownersEatOkay = [];

dogs.forEach(function (dog) {
  const recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  dog.recommendedFood = recommendedFood;

  if (dog.owners.find(el => el === 'Sarah')) {
    const checkFood =
      dog.curFood > dog.recommendedFood * 1.1
        ? "Sarah's dog eat's too much"
        : "Sarah's dog eat's too little";

    console.log(checkFood);
  }

  if (dog.curFood > dog.recommendedFood * 1.1) {
    ownersEatTooMuch.push(...dog.owners);
  } else if (dog.curFood < dog.recommendedFood * 0.9) {
    ownersEatTooLittle.push(...dog.owners);
  } else if (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  ) {
    ownersEatOkay.push(...dog.owners);
  }
});

const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

const str1 = ownersEatTooLittle.join(' and ') + "'s dogs eats too little";
console.log(str1);
const str2 = ownersEatTooMuch.join(' and ') + "'s dogs eats too much";
console.log(str2);

console.log(ownersEatTooLittle, ownersEatTooMuch, ownersEatOkay);

console.log(dogs, dogsCopy);
*/
