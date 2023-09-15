let currentDisplay = "";

function appendToDisplay(value) {
    currentDisplay += value;
    document.getElementById("display").value = currentDisplay;
}

function clearDisplay() {
    currentDisplay = "";
    document.getElementById("display").value = "";
}

function deleteElement(){
  currentDisplay = currentDisplay.slice(0,-1)
  document.getElementById("display").value = currentDisplay;
}

function calculateResult() {
   
    try {
      const data = {
        expression:currentDisplay
       };
       console.log(data)
      const headers = {
        'Content-Type': 'application/json'
       };
      const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data) 
    };
    fetch('http://localhost:3000/calculate', options)
    .then(res => {
      
      if (res.ok) {
       
        return res.json();
      } else {
        
        return (res.json())
        
      }
    })
    .then(data => {
      const result = data.result
      if(data.result){
        document.getElementById("err").innerHTML = ''
        document.getElementById("display").value = result;
        currentDisplay = result.toString();
      }else{

        document.getElementById("err").innerHTML = data.error;
        document.getElementById("display").value = ''
        currentDisplay = ''
      }
        
     
    })
    .catch(err => {
     
      console.error(err);
    });
        
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}
