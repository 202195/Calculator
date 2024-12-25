const display = document.getElementById("display");

function DisplayW(input) {
    const len = display.value.length;

    if (
        (len === 0 && "+*^./".includes(input)) || 
        (len > 0 && "+*/-^.".includes(display.value[len - 1]) && "+*/-^.".includes(input)) 
    ) {
        warning.style.display = "block"; 
    } else {
        display.value += input; 
    }
}

function Clear() {
    display.value = ""; 
}

function Erase() {
    display.value = display.value.slice(0, -1); 
}

function Result() {
    const expression = display.value; 

    try {
        const tokens = expression.split(/([-+*/^])/).filter(Boolean); 
        if (tokens.length === 0) throw new Error("Geçersiz ifade"); 


        const precedence = { "^": 3, "*": 2, "/": 2, "+": 1, "-": 1 };
        const values = []; 
        const operators = [];

        const applyOperator = () => {
            const b = values.pop();
            const a = values.pop();
            const operator = operators.pop();
            switch (operator) {
                case "+":
                    values.push(a + b);
                    break;
                case "-":
                    values.push(a - b);
                    break;
                case "*":
                    values.push(a * b);
                    break;
                case "/":
                    if (b === 0) throw new Error("Sıfıra bölme hatası");
                    values.push(a / b);
                    break;
                case "^":
                    values.push(a ** b);
                    break;
                default:
                    throw new Error("Geçersiz operatör");
            }
        };

        for (const token of tokens) {
            if (!isNaN(token)) {
                values.push(parseFloat(token));
            } else if (token in precedence) {
                while (
                    operators.length &&
                    precedence[operators[operators.length - 1]] >= precedence[token]
                ) {
                    applyOperator();
                }
                operators.push(token);
            } else {
                throw new Error("Geçersiz ifade");
            }
        }

        while (operators.length) {
            applyOperator();
        }

        display.value = values.pop();
    } catch (error) {
        display.value = "Hata"; 
    }
}
