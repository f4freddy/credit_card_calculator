(function(){


})();

var amounts = [];
var interests = [];
var index =0 ;

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
  calculateInterest(2000,18,35,0)
  

}
function hideHideFixedPayment(inPars){
  $("#fixedpayment").hide();
}


function calculateInterest(amount, interstRate, fixedAmount,previousInterest ){
  
  var interest = Math.round((amount * interstRate)/(100*12))
  
  var remainingAmount = Math.round((amount+interest)-fixedAmount);
  amounts.push(remainingAmount);
 
  previousInterest +=interest;
  interests.push(previousInterest);
  index++;
  if(remainingAmount > 0){
    calculateInterest(remainingAmount, interstRate, fixedAmount,previousInterest )
  }else{
    
    console.log(Math.floor(index/12));
    ploatMap()
  }
  
  
}

function ploatMap(){
  new Chartist.Line('.ct-chart', {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  series: [   
            amounts,
            interests
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
