"use strict";
const start = document.getElementById("start"),
    cancel = document.getElementById("cancel"),
    buttonsPlus = document.getElementsByTagName("button"),
    incomePlus = buttonsPlus[0],
    expensesPlus = buttonsPlus[1],
    depositCheck = document.getElementById("deposit-check"),
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
    additionalExpensesItem = document.querySelector(".additional_expenses-item"),
    depositAmount = document.querySelector(".deposit-amount"),
    depositBank = document.querySelector(".deposit-bank"),
    depositPercent = document.querySelector(".deposit-percent"),
    targetAmount = document.querySelector(".target-amount"),
    periodSelect = document.querySelector(".period-select"),
    periodAmount = document.querySelector(".period-amount");

let incomeItems = document.querySelectorAll(".income-items"),
    expensesItems = document.querySelectorAll(".expenses-items");

const isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const isText = function(value) {
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

function validatePercent() {
    if (
        1 <= depositPercent.value &&
    depositPercent.value <= 100 &&
    isNumber(depositPercent.value)
    ) {
        start.disabled = false;
        return true;
    } else {
        start.disabled = true;
        alert("enter number between 1 and 100");
        return false;
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
            this.getInfoDeposit();
            this.getBudget();

            this.showResult();

            for (let i = 0; i < dataInputs.length; i++) {
                if (dataInputs[i].type === "text") {
                    dataInputs[i].disabled = true;
                }
            }

            cancel.style.display = "block";
            start.style.display = "none";

            document.cookie = "data=" + JSON.stringify(this);
            document.cookie = "isLoad=true";
            localStorage.setItem("data", JSON.stringify(this));
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
        depositCheck.checked = false;
        this.depositHandler();

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

        localStorage.clear();
        // remove items form storage
        const res = document.cookie;
        const multiple = res.split(";");
        for (let i = 0; i < multiple.length; i++) {
            const key = multiple[i].split("=");
            document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
        }

        incomeItems.forEach(item => {
            item.querySelector(".income-title").value = "";
            item.querySelector(".income-amount").value = "";
        });

        expensesItems.forEach(item => {
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

    addNewBlock(e) {
        const targetStr = e.target.className.split(" ")[1].slice(0, -4);

        const insertBlock = items => {
            const cloneItem = items[0].cloneNode(true);
            const startStr = items[0].className.split("-")[0];
            cloneItem.querySelector(`.${startStr}-title`).value = "";
            cloneItem.querySelector(`.${startStr}-amount`).value = "";

            const button = document.querySelector(`.${startStr}_add`);

            items[0].parentNode.insertBefore(cloneItem, button);

            if (targetStr === "income") {
                incomeItems = document.querySelectorAll(`.${startStr}-items`);
            } else {
                expensesItems = document.querySelectorAll(`.${startStr}-items`);
            }

            if (items.length === 3) {
                button.style.display = "none";
            }
        };

        if (targetStr === "income") {
            insertBlock(incomeItems);
        } else {
            insertBlock(expensesItems);
        }
    }

    getExpInc() {
        const count = item => {
            const startStr = item.className.split("-")[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = item.querySelector(`.${startStr}-amount`).value;
            if (itemTitle !== "" && itemAmount !== "") {
                this[startStr][itemTitle] = +itemAmount;
            }
        };

        incomeItems.forEach(count);
        expensesItems.forEach(count);

        for (const key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
    getAddExpenses() {
        const count = item => {
            item = item.trim();
            if (item !== "") {
                this.addExpenses.push(item);
            }
        };

        const addExp = additionalExpensesItem.value.split(",");
        addExp.forEach(count);
    }
    getAddIncome() {
        const count = item => {
            item = item.trim();
            if (item !== "") {
                this.addIncome.push(item);
            }
        };

        const addInc = [...additionalIncomeItems].map(item => item.value);
        addInc.forEach(count);
    }
    getExpensesMonth() {
        for (const key in this.expenses) {
            this.expensesMonth += this.expenses[key];
        }
    }
    getBudget() {
        const monthDeposit = (this.moneyDeposit * this.percentDeposit) / 100;
        this.budgetMonth =
      this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }
    getTargetMonth() {
        return this.budgetMonth === 0 ?
            0 :
            Math.ceil(targetAmount.value / this.budgetMonth);
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
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
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
    changePercent() {
        const valueSelect = this.value;
        if (valueSelect === "other") {
            depositPercent.addEventListener("input", validatePercent);
            depositPercent.style.display = "inline-block";
        } else {
            start.disabled = false;
            depositPercent.value = valueSelect;
        }
    }
    depositHandler() {
        if (depositCheck.checked) {
            depositBank.style.display = "inline-block";
            depositAmount.style.display = "inline-block";
            this.deposit = true;
            depositBank.addEventListener("change", this.changePercent);
            start.disabled = true;
        } else {
            depositBank.style.display = "none";
            depositAmount.style.display = "none";
            depositPercent.style.display = "none";
            depositBank.value = "";
            depositAmount.value = "";
            depositPercent.value = "";
            this.deposit = false;
            start.disabled = false;
            depositBank.removeEventListener("change", this.changePercent);
        }
    }
    eventListeners() {
    // start
        start.addEventListener("click", this.start.bind(this));

        // reset
        cancel.addEventListener("click", this.reset.bind(this));

        incomePlus.addEventListener("click", this.addNewBlock);
        expensesPlus.addEventListener("click", this.addNewBlock);
        periodSelect.addEventListener("input", this.getPeriod.bind(this));

        depositCheck.addEventListener("change", this.depositHandler.bind(this));

        incomeTitle[1].addEventListener("input", validateTitle);
        incomeItem1.addEventListener("input", validateTitle);
        incomeItem2.addEventListener("input", validateTitle);
        expensesTitle[1].addEventListener("input", validateTitle);

        salaryAmount.addEventListener("input", validateNumbers);
        incomeAmount.addEventListener("input", validateNumbers);
        expensesAmount.addEventListener("input", validateNumbers);
    }
}

function getDataFromLocalStorage() {
    if (localStorage.getItem("data")) {
        const data = JSON.parse(localStorage.getItem("data"));
    } else {
        console.log("no data in local storage");
    }
}

const appData = new AppData();

getDataFromLocalStorage();
appData.eventListeners();

console.log(appData);
