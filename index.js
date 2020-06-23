"use strict";

let start = document.getElementById("start"),
  cancel = document.getElementById("cancel"),
  buttonsPlus = document.getElementsByTagName("button"),
  incomePlus = buttonsPlus[0],
  expensesPlus = buttonsPlus[1],
  checkbox = document.querySelector("#deposit-check"),
  additionalIncomeItems = document.querySelectorAll(".additional_income-item"),
  incomeItem1 = additionalIncomeItems[0],
  incomeItem2 = additionalIncomeItems[1],
  // right part, result total
  resultTotal = document.getElementsByClassName("result-total"),
  budgetMonthValue = resultTotal[0],
  budgetDayValue = resultTotal[1],
  expensesMonthValue = resultTotal[2],
  additionalIncomeValue = resultTotal[3],
  additionalExpensesValue = resultTotal[4],
  incomePeriodValue = resultTotal[5],
  targetMonthValue = resultTotal[6],
  // left part, inputs
  dataSection = document.querySelector(".data"),
  dataInputs = dataSection.getElementsByTagName("input"),
  salaryAmount = document.querySelector(".salary-amount"),
  incomeTitle = document.querySelectorAll(".income-title"),
  incomeAmount = document.querySelector(".income-amount"),
  // additionalIncomeItem = document.querySelectorAll(".additional_income-item"),
  // additionalIncomeAmount = document.querySelector(".additional_income-amount"),
  expensesTitle = document.querySelectorAll(".expenses-title"),
  expensesAmount = document.querySelector(".expenses-amount"),
  expensesItems = document.querySelectorAll(".expenses-items"),
  additionalExpensesItem = document.querySelector(".additional_expenses-item"),
  depositAmount = document.querySelector(".deposit-amount"),
  depositPercent = document.querySelector(".deposit-percent"),
  targetAmount = document.querySelector(".target-amount"),
  periodSelect = document.querySelector(".period-select"),
  incomeItems = document.querySelectorAll(".income-items"),
  periodAmount = document.querySelector(".period-amount");

const isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const isText = function (value) {
  // regular expression
  const regex = /^[a-zA-Z\s]*$/;
  if (!value) {
    return false;
  }
  if (value.match(regex)) {
    return true;
  } else {
    return false;
  }
};

// regex for title
const titlePattern = /^[\u0400-\u04FF.,:!? ]+$/;
const numbersPattern = /^[1-9][0-9]*([.][0-9]{2}|)$/;

const AppData = function () {
  this.budget = 0;
  this.income = {};
  this.addIncome = [];
  this.incomeMonth = 0;
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
};

AppData.prototype.start = function () {
  if (salaryAmount.value !== "") {
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getExpensesMonth();
    this.getIncome();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();

    this.showResult();

    for (let i = 0; i < dataInputs.length; i++) {
      if (dataInputs[i].type === "text") {
        dataInputs[i].disabled = true;
      }
    }

    cancel.style.display = "block";
    start.style.display = "none";
  } else {
    console.error("enter salary amount");
  }
};

AppData.prototype.reset = function () {
  this.budget = 0;
  this.expenses = {};
  this.expensesMonth = 0;
  this.income = {};
  this.addExpenses = [];
  this.addIncome = [];
  this.budgetMonth = 0;
  this.budgetDay = 0;

  // inputs on the left part
  salaryAmount.value = "";
  incomeTitle[1].value = "";
  incomeAmount.value = "";
  incomeItem1.value = "";
  incomeItem2.value = "";
  expensesTitle[1].value = "";
  expensesAmount.value = "";
  expensesItems.value = "";
  additionalExpensesItem.value = "";
  depositAmount.value = "";
  depositPercent.value = "";
  targetAmount.value = "";
  periodSelect.value = 1;
  periodAmount.value = "";

  incomeItems.forEach((item) => {
    item.querySelector(".income-title").value = "";
    item.querySelector(".income-amount").value = "";
  });

  expensesItems.forEach((item) => {
    item.querySelector(".expenses-title").value = "";
    item.querySelector(".expenses-amount").value = "";
  });

  this.showResult();

  for (let i = 0; i < dataInputs.length; i++) {
    dataInputs[i].disabled = false;
  }
  cancel.style.display = "none";
  start.style.display = "block";
};
AppData.prototype.showResult = function () {
  const _this = this;
  budgetMonthValue.value = this.budgetMonth;
  budgetDayValue.value = this.budgetDay;
  expensesMonthValue.value = this.expensesMonth;
  additionalExpensesValue.value = this.addExpenses.join(", ");
  additionalIncomeValue.value = this.addIncome.join(", ");
  targetMonthValue.value = this.getTargetMonth();
  this.calcIncomePeriodValue();
  this.getPeriod();

  incomePeriodValue.addEventListener("change", _this.getPeriod);
};
AppData.prototype.addExpensesBlock = function () {
  let cloneExpensesItem = expensesItems[0].cloneNode(true);
  cloneExpensesItem.querySelector(".expenses-title").value = "";
  cloneExpensesItem.querySelector(".expenses-amount").value = "";
  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
  expensesItems = document.querySelectorAll(".expenses-items");

  if (expensesItems.length === 3) {
    expensesPlus.style.display = "none";
  }
};
AppData.prototype.addIncomeBlock = function () {
  let cloneIncomeItem = incomeItems[0].cloneNode(true);
  cloneIncomeItem.querySelector(".income-title").value = "";
  cloneIncomeItem.querySelector(".income-amount").value = "";

  incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
  incomeItems = document.querySelectorAll(".income-items");

  if (incomeItems.length === 3) {
    incomePlus.style.display = "none";
  }
};
AppData.prototype.getExpenses = function () {
  const _this = this;
  expensesItems.forEach((item) => {
    let itemExpenses = item.querySelector(".expenses-title").value;
    let cashExpenses = item.querySelector(".expenses-amount").value;
    if (itemExpenses !== "" && cashExpenses !== "") {
      _this.expenses[itemExpenses] = +cashExpenses;
    }
  });
};
AppData.prototype.getIncome = function () {
  const _this = this;
  incomeItems.forEach((item) => {
    let itemIncome = item.querySelector(".income-title").value;
    let cashIncome = item.querySelector(".income-amount").value;
    if (itemIncome !== "" && cashIncome !== "") {
      _this.income[itemIncome] = +cashIncome;
    }
  });
  for (let key in this.income) {
    this.incomeMonth += +this.income[key];
  }
};
AppData.prototype.getAddExpenses = function () {
  let addExpenses = additionalExpensesItem.value.split(",");
  const _this = this;
  addExpenses.forEach((item) => {
    item = item.trim();
    if (item !== "") {
      _this.addExpenses.push(item);
    }
  });
};
AppData.prototype.getAddIncome = function () {
  const _this = this;
  additionalIncomeItems.forEach((item) => {
    let itemValue = item.value.trim();
    if (itemValue !== "") {
      _this.addIncome.push(itemValue);
    }
  });
};

AppData.prototype.getExpensesMonth = function () {
  for (let key in this.expenses) {
    this.expensesMonth += this.expenses[key];
  }
};
AppData.prototype.getBudget = function () {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  this.budgetDay = Math.floor(this.budgetMonth / 30);
};
AppData.prototype.getTargetMonth = function () {
  return this.budgetMonth === 0
    ? 0
    : Math.ceil(targetAmount.value / this.budgetMonth);
};
AppData.prototype.getStatusIncome = function () {
  if (this.budgetDay >= 1200) {
    return "high income";
  } else if (600 <= this.budgetDay && this.budgetDay < 1200) {
    return "middle income";
  } else if (0 <= this.budgetDay && this.budgetDay < 600) {
    return "low income";
  } else {
    return "something went wrong";
  }
};
AppData.prototype.getInfoDeposit = function () {
  if (this.deposit) {
    while (
      !isNumber(prompt("What is your deposit percent (must be number)?", 10))
    ) {
      this.percentDeposit = prompt(
        "What is your deposit percent (must be number)?",
        10
      );
    }
    while (
      !isNumber(
        prompt(
          "How much money do you have as a deposit (must be number)?",
          40000
        )
      )
    ) {
      this.moneyDeposit = prompt(
        "How much money do you have as a deposit (must be number)?: ",
        40000
      );
    }
  }
};
AppData.prototype.calcIncomePeriodValue = function () {
  incomePeriodValue.value =
    this.budgetMonth === 0 ? 0 : this.budgetMonth * periodSelect.value;
};
AppData.prototype.getPeriod = function () {
  periodAmount.textContent = periodSelect.value;
  this.calcIncomePeriodValue();
};

const appData = new AppData();

function validateTitle(event) {
  if (titlePattern.test(event.currentTarget.value)) {
    console.log("everithing is OK");
  } else {
    console.warn("only cyrillic letters, spaces and punctuation marks allowed");
  }
}

function validateNumbers(event) {
  if (numbersPattern.test(event.currentTarget.value)) {
    console.log("everithing is OK");
  } else {
    console.warn("only numbers allowed");
  }
}

AppData.prototype.eventListeners = function () {
  // start
  start.addEventListener("click", appData.start.bind(appData));

  // reset
  cancel.addEventListener("click", appData.reset.bind(appData));

  incomePlus.addEventListener("click", appData.addIncomeBlock);
  expensesPlus.addEventListener("click", appData.addExpensesBlock);
  periodSelect.addEventListener("input", appData.getPeriod.bind(appData));

  incomeTitle[1].addEventListener("input", validateTitle);
  incomeItem1.addEventListener("input", validateTitle);
  incomeItem2.addEventListener("input", validateTitle);
  expensesTitle[1].addEventListener("input", validateTitle);

  salaryAmount.addEventListener("input", validateNumbers);
  incomeAmount.addEventListener("input", validateNumbers);
  expensesAmount.addEventListener("input", validateNumbers);
};

appData.eventListeners();

console.log(appData);
