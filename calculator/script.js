
const chk = document.getElementById('toggle');

chk.addEventListener('change', () => {
	document.body.classList.toggle('light');
});


document.addEventListener('DOMContentLoaded', function() {
    const eq = document.getElementById('eq');
    const result = document.getElementById('result');
    const equals = document.getElementById('equals');
    let equation = "";
    let count = 0;
     


    document.getElementById('1').onclick = function(){
        equation += '1';
        eq.textContent = equation;
    }
    document.getElementById('2').onclick = function(){
        equation += '2';
        eq.textContent = equation;
    }
    document.getElementById('3').onclick = function(){
        equation += '3';
        eq.textContent = equation;
    }
    document.getElementById('4').onclick = function(){
        equation += '4';
        eq.textContent = equation;
    }
    document.getElementById('5').onclick = function(){
        equation += '5';
        eq.textContent = equation;
    }
    document.getElementById('6').onclick = function(){
        equation += '6';
        eq.textContent = equation;
    }
    document.getElementById('7').onclick = function(){
        equation += '7';
        eq.textContent = equation;
    }
    document.getElementById('8').onclick = function(){
        equation += '8';
        eq.textContent = equation;
    }
    document.getElementById('9').onclick = function(){
        equation += '9';
        eq.textContent = equation;
    }
    document.getElementById('0').onclick = function(){
        equation += '0';
        eq.textContent = equation;
    }
    document.getElementById('decimal').onclick = function(){
        equation += '.';
        eq.textContent = equation;
    }
    document.getElementById('add').onclick = function(){
        equation += '+';
        eq.textContent = equation;
    }
    document.getElementById('subtract').onclick = function(){
        equation += '-';
        eq.textContent = equation;
    }
    document.getElementById('multiply').onclick = function(){
        equation += '*';
        eq.textContent = equation;
    }
    document.getElementById('divide').onclick = function(){
        equation += '/';
        eq.textContent = equation;
    }
    document.getElementById('0l0').onclick = function(){
        equation += '/100';
        eq.textContent = equation;
    }
    document.getElementById('plus_moins').onclick = function(){
        equation += '*(-1)';
        eq.textContent = equation;
    }
    document.getElementById('c').onclick = function(){
        equation = '';
        eq.textContent = equation;
        result.textContent ="0";
    }
    document.getElementById('ms7').onclick = function(){
        equation = equation.toString().slice(0,-1);
        eq.textContent = equation;
    }
    equals.onclick = function(){
        count = eval(equation);
        result.textContent = count.toFixed(2);
    }
});