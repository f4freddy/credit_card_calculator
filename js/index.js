(function(){
  showHideFixedPayment();

})();

  function populateValue(inPars){
	var balanceVal = $("#balance").val();
	var rateVal = $("#rate").val();

	if (!$.isNumeric(balanceVal)||(balanceVal.length<1)) return;
	if (!$.isNumeric(rateVal)||(rateVal.length<1)) return;
	balanceVal = parseFloat(balanceVal);
	rateVal = parseFloat(rateVal);

	var minimumVal = 15;
	if (inPars===1){
		minimumVal = balanceVal*0.01 + balanceVal * rateVal/1200.0;
	}else{
		minimumVal = balanceVal*0.01*inPars;
	}
	if (minimumVal<15){
		if (balanceVal<15){
			minimumVal = balanceVal;
		}else{
			minimumVal = 15;
		}
	}
	$("#minimum").val(minimumVal.toFixed(2));
	return false;
}

function showHideFixedPayment(inPars){
  $("#fixedpayment").show();
  
  
  new Chartist.Line('.ct-chart', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [   
    [2, 1, 3.5, 7, 3],
    [1, 3, 4, 5, 6]
  ]
},{
  seriesBarDistance: 10,
  axisX: {
    offset: 60
  },
  axisY: {
    offset: 80,
    labelInterpolationFnc: function(value) {
      return '$'+value + 'k'
    },
    scaleMinSpace: 15
  }} );
}
function hideHideFixedPayment(inPars){
  $("#fixedpayment").hide();
}
