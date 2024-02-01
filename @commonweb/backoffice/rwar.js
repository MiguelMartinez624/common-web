function opSuma(num1, num2) {
    console.log(num1 + num2);
}

function opResta(num1, num2) {
    console.log(num1 - num2);
}

function opMultiplicacion(num1, num2) {
    console.log(num1 * num2);
}

function opDivision(num1, num2) {
    console.log(num1 / num2);
}

console.log('Calculadora por consola');
console.log('Instrucciones:');

console.log(`#1 - Coloca en la variable "op" segun lo que desees: 
1- Suma
2- Resta 
3- Multiplicacion 
4- Division`);

console.log(`#2 - Coloca en la variable 'Num1' el primer valor
y en 'Num2' segundo valor que deseas operar`);


let op, num1, num2;

num1 = 2;
num2 = 2;

switch (op = 0) {

    case 1:
        opSuma(num1, num2);
        break;

    case 2:
        opResta(num1, num2);
        break;

    case 3:
        opMultiplicacion(num1, num2);
        break;

    case 4:
        opDivision(num1, num2);
        break;

    default:
        console.log('Numero invalido, lee las instrucciones');
}