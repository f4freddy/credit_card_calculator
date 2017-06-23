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
    creditBalanceArray = [];
    monthlyInterestArray = [];
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
    creditBalanceArray.push(balanceVal);
    monthlyInterestArray.push(0);
    calculateInterest(balanceVal, rateVal, minimum, 0);
    if (fixedPaymentStatus) {
      calculateByFixedValue(balanceVal, rateVal, parseFloat($("#minimum").val()), 0, 0);
    }
  });

  $('#calculatePeriod').on('click', function () {
    amounts = [];
    interests = [];
    creditBalanceArray = [];
    monthlyInterestArray = [];
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
    creditBalanceArray.push(balance2);
    monthlyInterestArray.push(0);
    calculateInterestByTendure(balance2, rate2, emi, 0);
  });

})();

var amounts = [];
var creditBalanceArray = [];
var monthlyInterestArray = [];
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
  creditBalanceArray.push(remainingAmount);
  monthlyInterestArray.push(previousInterest);
  previousInterest += interest;
  interests.push(previousInterest);
  index++;
  if (remainingAmount > 0) {
    calculateInterest(remainingAmount, interstRate, fixedAmount, previousInterest);
  } else {
    $('#errorMsg').show();
    var msg = "It will take <font class='green'>" + getWords(index) + "</font> to payoff the balance. The total interest is <font class='green'>$" + formatCurrency(interests[index - 1]) + "</font>.";
    $('#errorMsg').html('<font class="black">' + msg + '</font>');

    ploatMap('#result_section #cchartdiv');
    var principalAmount = parseFloat($("#balance").val());
    ploatPiMap(interests[index - 1], principalAmount, '#result_section #cpiechartdiv');
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
  creditBalanceArray.push(remainingAmount);
  monthlyInterestArray.push(previousInterest);

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
    ploatMap('#result_section2 #cchartdiv');
    var principalAmount = parseFloat($("#balance2").val());
    ploatPiMap(interests[index - 1], principalAmount, '#result_section2 #cpiechartdiv');
  }


}

function ploatMap(seletor) {
  if (index - 1 >= 60) {
    var xAxisData = createXlabels(index);
  } else {
    var xAxisData = null;
  }

  $(seletor).highcharts({
    chart: {type: 'spline', plotBorderWidth: 1},
    title: {text: ''},
    xAxis: {min: 0, max: index, title: {text: ''}, gridLineWidth: 1,
      tickPositions: xAxisData,

      labels: {
        formatter: function () {

          if (index - 1 < 60) {
            return  this.value + 'mo';
          } else {
            let year = (this.value / 12);
            if (year % 1 !== 0) {
              year = parseFloat(year.toFixed(1));
            }
            return  year + 'yr';
          }
        }
      }
    },
    yAxis: {
      min: 0, title: {text: ''}, gridLineWidth: 1,
      labels: {
        formatter: function () {
          tempVal = this.value;
          if (this.value > 999)
            tempVal = (this.value / 1000).toFixed(1) + 'K';
          if (this.value > 999999)
            tempVal = (this.value / 1000000).toFixed(1) + 'M';
          return '$' + tempVal;
        }
      }
    },
    tooltip: {enabled: false, formatter: function () {
        return this.series.name + ': $' + this.y;
      }},
    plotOptions: {spline: {lineWidth: 4, states: {hover: {lineWidth: 3}}, marker: {enabled: false}}},
    legend: {layout: 'vertical', align: 'right', verticalAlign: 'top', floating: true, backgroundColor: '#FCFFC5', borderWidth: 1, x: -10, y: 3},
    series: [
      {name: 'Balance', data: creditBalanceArray},
      {name: 'Interest', data: monthlyInterestArray}
    ]
  });
}

function ploatPiMap(interest, amount, selector) {
  $(selector).highcharts({
    renderTo: 'cpiechartdiv',
    title: {text: ''},
    tooltip: {formatter: function () {
        return this.point.name + '<br><b>' + this.percentage.toFixed(1) + ' %</b><br>$' + this.y;
      }},
    plotOptions: {pie: {allowPointSelect: true, cursor: 'pointer', showInLegend: true, center: ["50%", "18%"],
        dataLabels: {color: '#eeeeee', connectorColor: '#FFFFFF', connectorPadding: -55, distance: -12, softConnector: false, formatter: function () {
            return this.percentage.toFixed(0) + '%';
          }}
      }},
    legend: {
      layout: 'vertical',
      y: -38,
      floating: true
    },
    series: [{
        type: 'pie',
        name: 'Share',
        data: [['Principal', formatAmount(amount)], ['Interest', formatAmount(interest)]]
      }]
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


function createXlabels(noOfMonths) {
  var indexValue = 4;
  var status = false;
  var newNumb = (noOfMonths - (noOfMonths % 12));

  var numb = ((newNumb / 12) - ((newNumb / 12) % 2)) * 12;
  if (numb % 5 === 0) {
    indexValue = 5;
  } else if (numb % 4 === 0) {
    indexValue = 4;
  } else if (numb % 3 === 0) {
    indexValue = 3;
  }

  var diviser = numb / indexValue;
  var returnArray = [];
  returnArray.push(0);
  for (var i = diviser; i <= numb; i += diviser) {
    returnArray.push(i);
  }

  if ((numb !== noOfMonths)) {
    returnArray.push(noOfMonths);
  }
  return returnArray;
}



	