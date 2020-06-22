"use strict";

let start = document.getElementById("start"),
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
  // left part, unputs
  salaryAmount = document.querySelector(".salary-amount"),
  incomeTitle = document.querySelector(".income-title"),
  incomeAmount = document.querySelector(".income-amount"),
  additionalIncomeItem = document.querySelector(".additional_income-item"),
  additionalIncomeAmount = document.querySelector(".additional_income-amount"),
  expensesTitle = document.querySelector(".expenses-title"),
  expensesItems = document.querySelectorAll(".expenses-items"),
  additionalExpensesItem = document.querySelector(".additional_expenses-item"),
  depositAmount = document.querySelector(".deposit-amount"),
  depositPercent = document.querySelector(".deposit-percent"),
  targetAmount = document.querySelector(".target-amount"),
  periodSelect = document.querySelector(".period-select"),
  incomItems = document.querySelectorAll(".income-items"),
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

const appData = {
  budget: 0,
  income: {},
  addIncome: [],
  incomeMonth: 0,
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  start: function () {
    if (salaryAmount.value !== '') {
      this.budget = +salaryAmount.value;
      this.getExpenses();
      this.getExpensesMonth();
      this.getIncome();
      this.getAddExpenses();
      this.getAddIncome();
      this.getBudget();
  
      this.showResult();
    } else {
      console.error("enter salary amount");
    }
  },
  showResult: function () {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(", ");
    additionalIncomeValue.value = this.addIncome.join(", ");
    targetMonthValue.value = this.getTargetMonth();
    this.calcIncomePeriodValue();
    this.getPeriod();

    incomePeriodValue.addEventListener('change', this.getPeriod);
  },
  addExpensesBlock: function () {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll(".expenses-items");

    if (expensesItems.length === 3) {
      expensesPlus.style.display = "none";
    }
  },
  addIncomeBlock: function () {
    let cloneIncomeItem = incomItems[0].cloneNode(true);
    incomItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomItems = document.querySelectorAll(".income-items");

    if (incomItems.length === 3) {
      incomePlus.style.display = "none";
    }
  },
  getExpenses: function () {
    expensesItems.forEach((item) => {
      let itemExpenses = item.querySelector(".expenses-title").value;
      let cashExpenses = item.querySelector(".expenses-amount").value;
      if (itemExpenses !== "" && cashExpenses !== "") {
        this.expenses[itemExpenses] = +cashExpenses;
      }
    });
  },
  getIncome: function () {
    incomItems.forEach((item) => {
      let itemIncome = item.querySelector(".income-title").value;
      let cashIncome = item.querySelector(".income-amount").value;
      if (itemIncome !== "" && cashIncome !== "") {
        this.income[itemIncome] = +cashIncome;
      }
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  },
  getAddExpenses: function () {
    let addExpenses = additionalExpensesItem.value.split(",");
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== "") {
        this.addExpenses.push(item);
      }
    });
  },
  getAddIncome: function () {
    additionalIncomeItems.forEach((item) => {
      let itemValue = item.value.trim();
      if (itemValue !== "") {
        this.addIncome.push(itemValue);
      }
    });
  },

  getExpensesMonth: function () {
    for (let key in this.expenses) {
      this.expensesMonth += this.expenses[key];
    }
  },
  getBudget: function () {
    this.budgetMonth =
    this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  },
  getTargetMonth: function () {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  },
  getStatusIncome: function () {
    if (this.budgetDay >= 1200) {
      return "high income";
    } else if (600 <= this.budgetDay && this.budgetDay < 1200) {
      return "middle income";
    } else if (0 <= this.budgetDay && this.budgetDay < 600) {
      return "low income";
    } else {
      return "something went wrong";
    }
  },
  getInfoDeposit: function () {
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
  },
  calcPeriod: function () {
    return this.budgetMonth * periodSelect.value;
  },
  calcIncomePeriodValue: function() {
    incomePeriodValue.value = this.calcPeriod();
  },
  getPeriod: function () {
    periodAmount.textContent = periodSelect.value;
    this.calcIncomePeriodValue();
  },
};

let statusIncome = appData.getStatusIncome();

let additionalExpensesString = "";
appData.addExpenses.forEach((item, index) => {
  additionalExpensesString +=
    item.slice(0, 1).toUpperCase() +
    item.substr(1).toLowerCase() +
    (index === appData.addExpenses.length - 1 ? "" : ", ");
});

start.addEventListener("click", appData.start.bind(appData));
incomePlus.addEventListener("click", appData.addIncomeBlock);
expensesPlus.addEventListener("click", appData.addExpensesBlock);
periodSelect.addEventListener("input", appData.getPeriod.bind(appData));
