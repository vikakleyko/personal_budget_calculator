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
  incomeTitle = document.querySelectorAll(".income-title"),
  incomeAmount = document.querySelector(".income-amount"),
  additionalIncomeItem = document.querySelector(".additional_income-item"),
  additionalIncomeAmount = document.querySelector(".additional_income-amount"),
  expensesTitle = document.querySelectorAll(".expenses-title"),
  expensesAmount = document.querySelector(".expenses-amount"),
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

// regex for title
const titlePattern = /^[\u0400-\u04FF.,:!? ]+$/;
const numbersPattern = /^[1-9][0-9]*([.][0-9]{2}|)$/;

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
    if (salaryAmount.value !== "") {
      appData.budget = +salaryAmount.value;
      appData.getExpenses();
      appData.getExpensesMonth();
      appData.getIncome();
      appData.getAddExpenses();
      appData.getAddIncome();
      appData.getBudget();

      appData.showResult();
    } else {
      console.error("enter salary amount");
    }
  },
  showResult: function () {
    budgetMonthValue.value = appData.budgetMonth;
    budgetDayValue.value = appData.budgetDay;
    expensesMonthValue.value = appData.expensesMonth;
    additionalExpensesValue.value = appData.addExpenses.join(", ");
    additionalIncomeValue.value = appData.addIncome.join(", ");
    targetMonthValue.value = appData.getTargetMonth();
    appData.calcIncomePeriodValue();
    appData.getPeriod();

    incomePeriodValue.addEventListener("change", appData.getPeriod);
  },
  addExpensesBlock: function () {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector(".expenses-title").value = "";
    cloneExpensesItem.querySelector(".expenses-amount").value = "";
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll(".expenses-items");

    if (expensesItems.length === 3) {
      expensesPlus.style.display = "none";
    }
  },
  addIncomeBlock: function () {
    let cloneIncomeItem = incomItems[0].cloneNode(true);
    cloneIncomeItem.querySelector(".income-title").value = "";
    cloneIncomeItem.querySelector(".income-amount").value = "";

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
        appData.expenses[itemExpenses] = +cashExpenses;
      }
    });
  },
  getIncome: function () {
    incomItems.forEach((item) => {
      let itemIncome = item.querySelector(".income-title").value;
      let cashIncome = item.querySelector(".income-amount").value;
      if (itemIncome !== "" && cashIncome !== "") {
        appData.income[itemIncome] = +cashIncome;
      }
    });

    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }
  },
  getAddExpenses: function () {
    let addExpenses = additionalExpensesItem.value.split(",");
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== "") {
        appData.addExpenses.push(item);
      }
    });
  },
  getAddIncome: function () {
    additionalIncomeItems.forEach((item) => {
      let itemValue = item.value.trim();
      if (itemValue !== "") {
        appData.addIncome.push(itemValue);
      }
    });
  },

  getExpensesMonth: function () {
    for (let key in appData.expenses) {
      appData.expensesMonth += appData.expenses[key];
    }
  },
  getBudget: function () {
    appData.budgetMonth =
      appData.budget + appData.incomeMonth - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },
  getTargetMonth: function () {
    return Math.ceil(targetAmount.value / appData.budgetMonth);
  },
  getStatusIncome: function () {
    if (appData.budgetDay >= 1200) {
      return "high income";
    } else if (600 <= appData.budgetDay && appData.budgetDay < 1200) {
      return "middle income";
    } else if (0 <= appData.budgetDay && appData.budgetDay < 600) {
      return "low income";
    } else {
      return "something went wrong";
    }
  },
  getInfoDeposit: function () {
    if (appData.deposit) {
      while (
        !isNumber(prompt("What is your deposit percent (must be number)?", 10))
      ) {
        appData.percentDeposit = prompt(
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
        appData.moneyDeposit = prompt(
          "How much money do you have as a deposit (must be number)?: ",
          40000
        );
      }
    }
  },
  calcPeriod: function () {
    return appData.budgetMonth * periodSelect.value;
  },
  calcIncomePeriodValue: function () {
    incomePeriodValue.value = appData.calcPeriod();
  },
  getPeriod: function () {
    periodAmount.textContent = periodSelect.value;
    appData.calcIncomePeriodValue();
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

function validateTitle(event) {
  if (titlePattern.test(event.currentTarget.value)) {
    console.log("everithing is OK");
  } else {
    console.error(
      "only cyrillic letters, spaces and punctuation marks allowed"
    );
  }
}

function validateNumbers(event) {
  if (numbersPattern.test(event.currentTarget.value)) {
    console.log("everithing is OK");
  } else {
    console.error(
      "only numbers allowed"
    );
  }
}

start.addEventListener("click", appData.start);
incomePlus.addEventListener("click", appData.addIncomeBlock);
expensesPlus.addEventListener("click", appData.addExpensesBlock);
periodSelect.addEventListener("input", appData.getPeriod);

incomeTitle[1].addEventListener("input", validateTitle);
additionalIncomeItem.addEventListener("input", validateTitle);
expensesTitle[1].addEventListener("input", validateTitle);

salaryAmount.addEventListener("input", validateNumbers);
incomeAmount.addEventListener("input", validateNumbers);
additionalIncomeAmount.addEventListener("input", validateNumbers);
expensesAmount.addEventListener("input", validateNumbers);