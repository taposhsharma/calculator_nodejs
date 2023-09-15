const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()

app.use(express.json());
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')



app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))

const PORT = 3000

app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`)
})



app.get('',(req,res)=>{
    res.render('index')
})

app.post('/calculate',(req,res)=>{
    
    // console.log((req.body.expression))
    try{
    const result = calculateExpression(req.body.expression)
     res.status(200).json({result:result}); 
    }
    catch(error){
        // console.log(error.message)
        res.status(400).json({error:error.message}); 
    }
})


function calculateExpression(expression) {
    const operators = ['+', '-', '*', '/'];
    const precedence = {'+': 1, '-': 1, '*': 2, '/': 2};

    const tokenize = (expression) => {
        return expression
            .replace(/ /g, '') 
            .split(/([+\-*/()])/) 
            .filter(token => token !== ''); 
    };

    const shuntingYard = (tokens) => {
        const output = [];
        const stack = [];

        for (const token of tokens) {
            
            if (!isNaN(parseFloat(token))) {
                output.push(parseFloat(token));
            } else if (operators.includes(token)) {
                while (
                    stack.length > 0 &&
                    operators.includes(stack[stack.length - 1]) &&
                    precedence[token] <= precedence[stack[stack.length - 1]]
                ) {
                    output.push(stack.pop());
                }
                stack.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop();
            }
        }

        while (stack.length > 0) {
            output.push(stack.pop());
        }
        
        return output;
    };

    const evaluateRPN = (tokens) => {
        const stack = [];

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (operators.includes(token)) {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+':
                        
                        stack.push(a + b);
                        
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        if(b===0){
                            throw new Error("Dividing by zero not allowed")
                        }
                        stack.push(a / b);
                        break;
                }
            }
        }

        if(!stack[0]){
            throw new Error("Not a valid expression")
        }
        return stack[0];
    };

    const tokens = tokenize(expression);
   
    const rpn = shuntingYard(tokens);
    
    const result = evaluateRPN(rpn);

    return result;
}

