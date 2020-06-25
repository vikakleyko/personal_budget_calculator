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

class AppData {
  constructor(
    budget = 0,
    income = {},
    addIncome = [],
    incomeMonth = 0,
    expenses = {},
    addExpenses = [],
    deposit = false,
    percentDeposit = 0,
    moneyDeposit = 0,
    budgetDay = 0,
    budgetMonth = 0,
    expensesMonth = 0
  ) {
    this.budget = budget;
    this.income = income;
    this.addIncome = addIncome;
    this.incomeMonth = incomeMonth;
    this.expenses = expenses;
    this.addExpenses = addExpenses;
    this.deposit = deposit;
    this.percentDeposit = percentDeposit;
    this.moneyDeposit = moneyDeposit;
    this.budgetDay = budgetDay;
    this.budgetMonth = budgetMonth;
    this.expensesMonth = expensesMonth;
  }
  start() {
    if (salaryAmount.value !== "") {
      this.budget = +salaryAmount.value;
      this.getExpInc();
      this.getExpensesMonth();
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
  }

  reset() {
    this.budget = 0;
    this.expenses = {};
    this.expensesMonth = 0;
    this.income = {};
    this.addExpenses = [];
    this.addIncome = [];
    this.budgetMonth = 0;
    this.budgetDay = 0;
    this.incomeMonth = 0;

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
      console.log(item);
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
  }
  showResult() {
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
  }
  addExpensesBlock() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector(".expenses-title").value = "";
    cloneExpensesItem.querySelector(".expenses-amount").value = "";
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll(".expenses-items");

    if (expensesItems.length === 3) {
      expensesPlus.style.display = "none";
    }
  }
  addIncomeBlock() {
    const cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.querySelector(".income-title").value = "";
    cloneIncomeItem.querySelector(".income-amount").value = "";

    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItems = document.querySelectorAll(".income-items");

    if (incomeItems.length === 3) {
      incomePlus.style.display = "none";
    }
  }

  addNewBlockTest() {
    const insertBlock = (items) => {
      console.log(items[0]);
      const cloneItem = items[0].cloneNode(true);
      const startStr = items[0].className.split("-")[0];
      cloneItem.querySelector(`.${startStr}-title`).value = "";
      cloneItem.querySelector(`.${startStr}-amount`).value = "";

      const button = document.querySelector(`.${startStr}_add`);

      items[0].parentNode.insertBefore(cloneItem, button);
      items = document.querySelectorAll(`.${startStr}-items`);

      if (items.length === 3) {
        button.style.display = "none";
      }
    };

    insertBlock(incomeItems);
  }

  getExpInc() {
    const count = (item) => {
      const startStr = item.className.split("-")[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      if (itemTitle !== "" && itemAmount !== "") {
        this[startStr][itemTitle] = +itemAmount;
      }
    };

    incomeItems.forEach(count);
    expensesItems.forEach(count);

    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }
  getAddExpenses() {
    const count = (item) => {
      item = item.trim();
      if (item !== "") {
        this.addExpenses.push(item);
      }
    };

    const addExp = additionalExpensesItem.value.split(",");
    addExp.forEach(count);
  }
  getAddIncome() {
    const count = (item) => {
      item = item.trim();
      if (item !== "") {
        this.addIncome.push(item);
      }
    };

    const addInc = [...additionalIncomeItems].map((item) => item.value);
    console.log(addInc);
    addInc.forEach(count);
  }
  getExpensesMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += this.expenses[key];
    }
  }
  getBudget() {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }
  getTargetMonth() {
    return this.budgetMonth === 0
      ? 0
      : Math.ceil(targetAmount.value / this.budgetMonth);
  }
  getStatusIncome() {
    if (this.budgetDay >= 1200) {
      return "high income";
    } else if (600 <= this.budgetDay && this.budgetDay < 1200) {
      return "middle income";
    } else if (0 <= this.budgetDay && this.budgetDay < 600) {
      return "low income";
    } else {
      return "something went wrong";
    }
  }
  getInfoDeposit() {
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
  }
  calcIncomePeriodValue() {
    incomePeriodValue.value =
      this.budgetMonth === 0 ? 0 : this.budgetMonth * periodSelect.value;
  }
  getPeriod() {
    periodAmount.textContent = periodSelect.value;
    this.calcIncomePeriodValue();
  }
  eventListeners() {
    // start
    start.addEventListener("click", this.start.bind(this));

    // reset
    cancel.addEventListener("click", this.reset.bind(this));

    incomePlus.addEventListener("click", this.addIncomeBlock);
    expensesPlus.addEventListener("click", this.addExpensesBlock);
    periodSelect.addEventListener("input", this.getPeriod.bind(this));

    incomeTitle[1].addEventListener("input", validateTitle);
    incomeItem1.addEventListener("input", validateTitle);
    incomeItem2.addEventListener("input", validateTitle);
    expensesTitle[1].addEventListener("input", validateTitle);

    salaryAmount.addEventListener("input", validateNumbers);
    incomeAmount.addEventListener("input", validateNumbers);
    expensesAmount.addEventListener("input", validateNumbers);
  }
}

const appData = new AppData();

appData.eventListeners();

console.log(appData);
