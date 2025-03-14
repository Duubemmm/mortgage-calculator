const calculateButton = document.querySelector(".calculate-button");
const clearButton = document.querySelector(".clear-button");
const mortgageAmount = document.querySelector("#mortgage-amount");
const mortgageTerm = document.querySelector("#mortgage-term");
const interestRate = document.querySelector("#interest-rate");
const displayMortgagePayment = document.querySelector(".displayresult-section");
const resultSection = document.querySelector(".result-section");
const mortgageAmountError = document.querySelector(".mortgage-amount-error");
const mortgageTermError = document.querySelector(".mortgage-term-error");
const interestRateError = document.querySelector(".interest-rate-error");
const mortgageTypeError = document.querySelector(".mortgage-type-error");

calculateButton.addEventListener("click", calculateRepayment);

function calculateRepayment(event) {
  event.preventDefault();
  clearErrors();

  const mortgageAmountValue = document.querySelector("#mortgage-amount").value;
  const mortgageTermValue = document.querySelector("#mortgage-term").value;
  const interestRateValue = document.querySelector("#interest-rate").value;

  const mortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  ).value;

  let isValid = true;

  if (!mortgageAmountValue) {
    showError(
      mortgageAmountError, "This field is required.",
      mortgageAmount,
      mortgageAmount.closest(".input-container"));
    isValid = false;
  } else if (!isValidNumber(mortgageAmountValue)) {
    showError(
      mortgageAmountError, "Please enter a valid number.",
      mortgageAmount,
      mortgageAmount.closest(".input-container"));
    isValid = false;
  } else if (parseFloat(mortgageAmountValue) <= 0) {
    showError(mortgageAmountError, "Please enter a positive number.",
      mortgageAmount,
      mortgageAmount.closest(".input-container"));
    isValid = false;
  }

  if (!mortgageTermValue) {
    showError(mortgageTermError, "This field is required.",
      mortgageTerm,
      mortgageTerm.closest(".input-container"));
    isValid = false;
  } else if (!isValidNumber(mortgageTermValue)) {
    showError(mortgageTermError, "Please enter a valid number.",
      mortgageTerm,
      mortgageTerm.closest(".input-container"));
    isValid = false;
  } else if (parseFloat(mortgageTermValue) <= 0) {
    showError(mortgageTermError, "Please enter a positive number.",
      mortgageTerm,
      mortgageTerm.closest(".input-container"));
    isValid = false;
  }

  if (!interestRateValue) {
    showError(interestRateError, "This field is required.",
      interestRate,
      interestRate.closest(".input-container"));
    isValid = false;
  } else if (!isValidNumber(interestRateValue)) {
    showError(interestRateError, "Please enter a valid number.",
      interestRate,
      interestRate.closest(".input-container"));
    isValid = false;
  } else if (parseFloat(interestRateValue) <= 0) {
    showError(interestRateError, "Please enter a positive number.",
      interestRate,
      interestRate.closest(".input-container"));
    isValid = false;
  }

  if (!mortgageType) {
    showError(mortgageTypeError, "Please select a mortgage type.");
    isValid = false;
  }

  if (!isValid) return;

  const principal = parseFloat(mortgageAmountValue);
  const loanTermYears = parseFloat(mortgageTermValue);
  const annualInterestRate = parseFloat(interestRateValue);

  if (mortgageType === "repayment") {
    //Calculate monthly repayment
    const monthlyRepayment = calculateMortgagePayment(
      principal,
      loanTermYears,
      annualInterestRate
    );

    // Calculate total repayment
    const totalRepayment = monthlyRepayment * loanTermYears * 12;

    displayMortgagePayment.innerHTML = `<div class="repaymentdisplayresult" aria-labelledby="display-result-heading">
            <h2 id="display-result-heading">Your results</h2>
            <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click 'calculate repayments' again.</p>
            <div class="monthlypayment-div">
                <p>Your monthly repayments</p>
                <h1>$${monthlyRepayment.toFixed(3)}</h1>
                <p>Total you'll repay over the term</p>
                <h2 id="display-monthly-repayment">$${totalRepayment.toFixed(3)}</h2>
            </div>
        </div>`;
  } else if (mortgageType === "interest-only") {
    const monthlyRepayment = calculateMortgagePayment(
      principal,
      loanTermYears,
      annualInterestRate
    );
    console.log(monthlyRepayment);

    const monthlyInterest = ((annualInterestRate / 100) * principal) / 12;
    const totalInterest = monthlyInterest * loanTermYears * 12;

    displayMortgagePayment.innerHTML = `<div class="interestdisplayresult" aria-labelledby="display-result-heading">
        <h2 id="display-result-heading">Your results</h2>
        <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click 'calculate repayments' again.</p>
        <div class="monthlypayment-div">
            <p>Your monthly Interest</p>
            <h1>$${monthlyInterest.toFixed(3)}</h1>
            <p>Total you'll repay over the term</p>
            <h2 id="display-monthly-repayment">$${totalInterest.toFixed(3)}</h2>
        </div>
    </div>`;
  }
  displayMortgagePayment.style.display = "block";
  resultSection.style.display = "none";
}

function calculateMortgagePayment(
  principal,
  loanTermYears,
  annualInterestRate
) {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const mortgagePayment =
    (principal *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return mortgagePayment;
}

clearButton.addEventListener("click", clearValueButton);

function clearValueButton() {
  document.querySelector("#mortgage-amount").value = "";
  document.querySelector("#mortgage-term").value = "";
  document.querySelector("#interest-rate").value = "";

  const selectedMortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  );
  if (selectedMortgageType) {
    selectedMortgageType.checked = false;
  }
  displayMortgagePayment.style.display = "none";
  resultSection.style.display = "block";
}

function showError(errorElement, message, inputElement, containerElement) {
    errorElement.textContent = message;

    if (inputElement) {
      inputElement.style.borderColor = "red";
    }
  
    if (containerElement) {
      containerElement.style.borderColor = "red";
  }

  const inputSymbol = containerElement?.querySelector(".input-symbol");
  const inputTerm = containerElement?.querySelector(".input-term");

  if (inputSymbol) {
    inputSymbol.style.background = "red";
    inputSymbol.style.color = "white";
  }

  if (inputTerm) {
    inputTerm.style.background = "red";
    inputTerm.style.color = "white";
  }
}
  
  function clearErrors() {
    mortgageAmountError.textContent = "";
    mortgageTermError.textContent = "";
    interestRateError.textContent = "";
    mortgageTypeError.textContent = "";

  const inputContainers = document.querySelectorAll(".input-container");
  inputContainers.forEach(container => {
    container.style.borderColor = ""; // Reset to default
  

  const inputSymbol = container.querySelector(".input-symbol");
  const inputTerm = container.querySelector(".input-term");

  if (inputSymbol) {
      inputSymbol.style.borderColor = "";
    }

    if (inputTerm) {
      inputTerm.style.borderColor = "";
    }
  });

  const inputFields = document.querySelectorAll("input");
  inputFields.forEach(input => {
    input.style.borderColor = ""; // Reset to default
  });
}
  
  function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  }
