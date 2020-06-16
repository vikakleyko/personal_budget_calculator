"use strict";

const buttonCount = document.getElementById("start"),
  buttonsPlus = document.getElementsByTagName("button"),
  btnPlus1 = buttonsPlus[0],
  btnPlus2 = buttonsPlus[1],
  checkbox = document.querySelector("#deposit-check"),
  additionalIncomeItems = document.querySelectorAll(".additional_income-item"),
  incomeItem1 = additionalIncomeItems[0],
  incomeItem2 = additionalIncomeItems[1],
  // right part, result total
  resultTotal = document.getElementsByClassName("result-total"),
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
  expensesAmount = document.querySelector(".expenses-amount"),
  additionalExpensesItem = document.querySelector(".additional_expenses-item"),
  depositAmount = document.querySelector(".deposit-amount"),
  depositPercent = document.querySelector(".deposit-percent"),
  targetAmount = document.querySelector(".target-amount"),
  periodSelect = document.querySelector(".period-select");

