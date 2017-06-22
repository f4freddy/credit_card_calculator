(function () {
  $('#calculate').on('click', function () {
    var balanceVal = parseFloat($("#balance").val());
    var rateVal = parseFloat($("#rate").val());
    var minimum = parseFloat($("#minimum").val());
    var fixedPaymentStatus = ($("#fixedpayment").is(':visible'));
    if (fixedPaymentStatus) {
      var minimum = parseFloat($("#fixedpaymentamount").val());
    }

    $('#errorMsg, #errorMsg3, #errorMsg2').hide();


    amounts = [];
    interests = [];
    chartData1 = [];
    chartData2 = [];
    index = 0;

    var MinimumInterest = Math.round((balanceVal * rateVal) / (100 * 12));
    if (minimum <= MinimumInterest) {
      $('#errorMsg').show();
      var msg = "It is unlikely that you can payoff the balance with a monthly payment of $" + formatCurrency(minimum) + ". You will need to pay an amount higher than $" + formatCurrency(MinimumInterest) + ".";
      $('#errorMsg').html('<font class="red">' + msg + '</font>');
      return false;
    }
    $('#result_section').show();
    $('#result_section2').hide();
    calculateInterest(balanceVal, rateVal, minimum, 0);
    if (fixedPaymentStatus) {
      calculateByFixedValue(balanceVal, rateVal, parseFloat($("#minimum").val()), 0, 0);
    }
  });

  $('#calculatePeriod').on('click', function () {
    amounts = [];
    interests = [];
    chartData1 = [];
    chartData2 = [];
    emi = 0;
    index = 0;
    var balance2 = parseFloat($("#balance2").val());
    var rate2 = parseFloat($("#rate2").val());
    var year2 = parseFloat($("#year2").val());
    var month2 = parseFloat($("#month2").val());
    var numberOfMounths = parseFloat(year2) * 12 + month2;
    emi = calculateEmi(balance2, numberOfMounths, rate2);
    $('#errorMsg, #errorMsg3, #errorMsg2').hide();
    $('#result_section').hide();
    $('#result_section2').show();
    calculateInterestByTendure(balance2, rate2, emi, 0);
  });

})();

var amounts = [];
var chartData1 = [];
var chartData2 = [];
var interests = [];
var index = 0;
var emi = 0;

function populateValue(inPars) {
  var balanceVal = $("#balance").val();
  var rateVal = $("#rate").val();
  if (!$.isNumeric(balanceVal) || (balanceVal.length < 1))
    return;
  if (!$.isNumeric(rateVal) || (rateVal.length < 1))
    return;
  balanceVal = parseFloat(balanceVal);
  rateVal = parseFloat(rateVal);

  var minimumVal = 15;
  if (inPars === 1) {
    minimumVal = balanceVal * 0.01 + balanceVal * rateVal / 1200.0;
  } else {
    minimumVal = balanceVal * 0.01 * inPars;
  }
  if (minimumVal < 15) {
    if (balanceVal < 15) {
      minimumVal = balanceVal;
    } else {
      minimumVal = 15;
    }
  }
  $("#minimum").val(minimumVal.toFixed(2));
  return false;
}

function calculateEmi(loanAmount, numberOfMonths, rateOfInterest) {
  var monthlyInterestRatio = (rateOfInterest / 100) / 12;
  var top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
  var bottom = top - 1;
  var sp = top / bottom;
  var emi = ((loanAmount * monthlyInterestRatio) * sp);
  return emi;
}

function hideHideFixedPayment(inPars) {
  $("#fixedpayment").hide();
}


function calculateInterest(amount, interstRate, fixedAmount, previousInterest) {
  var interest = (amount * interstRate) / (100 * 12);
  var remainingAmount2 = (amount + interest) - fixedAmount;
  var remainingAmount = (amount + interest) - fixedAmount;
  if (remainingAmount < 0) {
    remainingAmount = 0;
  }

  amounts.push(remainingAmount);
  chartData1.push({x: index, y: remainingAmount});
  chartData2.push({x: index, y: previousInterest});
  previousInterest += interest;
  interests.push(previousInterest);
  index++;
  if (remainingAmount > 0) {
    calculateInterest(remainingAmount, interstRate, fixedAmount, previousInterest);
  } else {
    $('#errorMsg').show();
    var msg = "It will take <font class='green'>" + getWords(index) + "</font> to payoff the balance. The total interest is <font class='green'>$" + formatCurrency(interests[index - 1]) + "</font>.";
    $('#errorMsg').html('<font class="black">' + msg + '</font>');

    ploatMap();
    var principalAmount = parseFloat($("#balance").val());
    ploatPiMap(interests[index - 1], principalAmount);
  }
}


function calculateByFixedValue(amount, interstRate, fixedAmount, previousInterest, monthIndex) {
  var interest = (amount * interstRate) / (100 * 12);
  var remainingAmount = (amount + interest) - fixedAmount;
  if (remainingAmount < 0) {
    remainingAmount = 0;
  }
  monthIndex++;
  previousInterest += interest;
  if (remainingAmount > 0) {
    calculateByFixedValue(remainingAmount, interstRate, fixedAmount, previousInterest, monthIndex);
  } else {
    $('#errorMsg3').show();
    var msg = " <font class='black'> If pay the minimum of " + formatCurrency(fixedAmount) + " per month only, it will take </font><font class='green'>" + getWords(monthIndex) + " to payoff. With this, the total interest is </font><font class='green'>$" + formatCurrency(previousInterest) + "</font>";
    $('#errorMsg3').html('<font class="black">' + msg + '</font>');

  }
}


function calculateInterestByTendure(amount, interstRate, fixedAmount, previousInterest) {
  var interest = (amount * interstRate) / (100 * 12);
  var remainingAmount = (amount + interest) - fixedAmount;
  if (remainingAmount < 0) {
    remainingAmount = 0;
  }

  amounts.push(remainingAmount);
  chartData1.push({x: index, y: remainingAmount});
  chartData2.push({x: index, y: previousInterest});

  previousInterest += interest;

  interests.push(previousInterest);
  index++;
  if (remainingAmount > 0) {
    calculateInterestByTendure(remainingAmount, interstRate, fixedAmount, previousInterest);
  } else {

    var year2 = parseFloat($("#year2").val());
    var month2 = parseFloat($("#month2").val());

    var periode = '';
    if (year2 !== 0) {
      periode = year2 + ((year2 === 1) ? " year" : " years");
    }
    if (year2 !== 0 && month2 !== 0) {
      periode += " " + month2 + ((month2 === 1) ? " month" : " months");
    }

    if ((year2 === 0) && month2 !== 0) {
      periode = month2 + ((month2 === 1) ? " month" : " months");
    }
    $('#errorMsg2').show();
    var msg = "<font class='green'>$" + formatCurrency(emi) + " per month </font> <font class='black'> is needed to payoff the balance in " + periode + ". Total interest is </font><font class='green'>$" + formatCurrency(interests[index - 1]) + "</font>.";
    $('#errorMsg2').html('<font class="black">' + msg + '</font>');
    ploatMap2();
    var principalAmount = parseFloat($("#balance2").val());
    ploatPiMap2(interests[index - 1], principalAmount);
  }


}

function ploatMap() {

  var xAxisData = createXlabels(index - 1);  
  if(amounts[0] > interests[index - 1]){
    var yAxisData = createYLabel(amounts[0]);
  }else{
  var yAxisData = createYLabel(interests[index - 1]);
  }
  new Chartist.Line('.line-chart .ct-chart', {
    labels: Array.from(Array(index), (e, i) => i),
    series: [
      {
        name: 'series-1',
        data: chartData1
      },
      {
        name: 'series-2',
        data: chartData2
      }
    ]
  }, {
    fullWidth: true,
  chartPadding: {
    right: 40
  },
    axisX: {
      low: 0,
      type: Chartist.FixedScaleAxis,
      ticks: xAxisData,
      high: xAxisData[xAxisData.length-1],
      labelInterpolationFnc: function (value) {
        if (index - 1 < 60) {
          return  value + 'mo';
        } else {
          let year = (value / 12);
          if (year % 1 !== 0) {
            year = parseFloat(year.toFixed(1));
          }
          return  year + 'yr';
        }
      }
    },
    axisY: {
      type: Chartist.FixedScaleAxis,
      ticks: yAxisData,
      low: 0,
      high: yAxisData[3],
      labelInterpolationFnc: function (value) {
        if (parseFloat(value) >= 1000) {
          return '$' + parseFloat(value / 1000) + 'K';
        }
        return '$' + value;
      }
    }
  });

}
function ploatMap2() {
  var xAxisData = createXlabels(index - 1);
  if(amounts[0] > interests[index - 1]){
    var yAxisData = createYLabel(amounts[0]);
  }else{
    var yAxisData = createYLabel(interests[index - 1]);
  }
  new Chartist.Line('.ct-chart2', {
    labels: Array.from(Array(index), (e, i) => i),
    series: [
      {
        name: 'series-1',
        data: chartData1
      },
      {
        name: 'series-2',
        data: chartData2
      }
    ]
  }, {
    axisX: {
      low: 0,
      type: Chartist.FixedScaleAxis,
      ticks: xAxisData,
      high: xAxisData[xAxisData.length-1],
      labelInterpolationFnc: function (value) {
        if (index - 1 < 60) {
          return  value + 'mo';
        } else {
          let year = (value / 12);
          if (year % 1 !== 0) {
            year = parseFloat(year.toFixed(1));
          }
          return  year + 'yr';
        }
      }
    },
    axisY: {
      type: Chartist.FixedScaleAxis,
      ticks: yAxisData,
      low: 0,
      high: yAxisData[3],
      labelInterpolationFnc: function (value) {
        if (parseFloat(value) >= 1000) {
          return '$' + parseFloat(value / 1000) + 'K';
        }
        return '$' + value;
      }
    }
  });
}

function ploatPiMap(interest, amount) {
  var data = {series: [amount, interest]};
  var sum = function (a, b) {
    return a + b
  };

  new Chartist.Pie('.ct-chart-pi', data, {
    labelInterpolationFnc: function (value) {
      return Math.round(value / data.series.reduce(sum) * 100) + '%';
    }
  });
};

function ploatPiMap2(interest, amount) {
  var data = {series: [amount, interest]};
  var sum = function (a, b) {
    return a + b;
  };

  new Chartist.Pie('.ct-chart-pi2', data, {
    labelInterpolationFnc: function (value) {
      return Math.round(value / data.series.reduce(sum) * 100) + '%';
    }
  });
};

function getWords(monthCount) {
  function getPlural(number, word) {
    return number === 1 && word.one || word.other;
  }

  var months = {one: 'month', other: 'months'},
          years = {one: 'year', other: 'years'},
          m = monthCount % 12,
          y = Math.floor(monthCount / 12),
          result = [];
  y && result.push(y + ' ' + getPlural(y, years));
  m && result.push(m + ' ' + getPlural(m, months));
  return result.join(' and ');
}

function formatAmount(price) {
  return parseFloat((Math.round(price * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2));
}

function formatCurrency(price) {
  return price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
function radioButtonClick(value) {
  $('#fixedpayment').hide();
  if (value === 1) {
    $('#fixedpayment').show();
  }
}

function createYLabel(maxAmount) {
  var length = parseInt(maxAmount).toString().length;
  var firstWord = parseInt(maxAmount.toString().charAt(0));
  var newNum = ((firstWord + 1) % 3 === 0) ? (firstWord + 1) : ((firstWord + 1) - ((firstWord + 1) % 3)) + 3;

  var naM = pad(newNum, length) / 3;
  return [0, naM, 2 * naM, 3 * naM]
}

function pad(n, len) {
  len--;
  for (i = 0; i < len; i++) {
    n = n + '0';
  }
  return n;
}

function createXlabels(noOfMonths) {
  var indexValue = 4;
  var status = false;

  if (noOfMonths < 60) {
    var numb = noOfMonths;
    if (numb % 5 === 0) {
      indexValue = 5;
      status = true;
    } else if (numb % 4 === 0) {
      indexValue = 4;
      status = true;
    } else if (numb % 3 === 0) {
      indexValue = 3;
      status = true;
    }

  } else {
    var numb = (noOfMonths - (noOfMonths % 12));

    if (numb % 5 === 0) {
      indexValue = 5;
      status = true;
    } else if (numb % 4 === 0) {
      indexValue = 4;
      status = true;
    } else if (numb % 3 === 0) {
      indexValue = 3;
      status = true;
    }
  }
  var diviser = (status) ? (numb / indexValue) : ((numb - (numb % indexValue)) / indexValue);
  var returnArray = [];
  returnArray.push(0);
  for (var i = diviser; i <= numb; i += diviser) {
    returnArray.push(i);
  }
  
  if ((!status) || (numb !== noOfMonths)) {
    if(numb !== noOfMonths){
      returnArray.push(noOfMonths);
    }else {
    returnArray.push(noOfMonths + 1);
  }
  }
  return returnArray;
}
