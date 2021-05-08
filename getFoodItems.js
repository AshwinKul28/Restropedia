var dataParse
var fs = require('fs');

function knapsackCalorie(data, calorie){
  // This implementation uses dynamic programming.
  // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
  // which will be later used as the code execution goes on.
  // This is called memoization in programming.
  // The cell will store best solution objects for different capacities and selectable items.
  var memo = [];
  // Filling the sub-problem solutions grid.
  for (var i = 0; i < data.length; i++) {
    // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
    var row = [];
    for (var cap = 1; cap <= calorie; cap++) {
      // console.log(i, cap)
      row.push(getSolution(i,cap));
    }
    memo.push(row);
  }

  // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
  return(getLast());

  function getLast(){
    var lastRow = memo[memo.length - 1];
    return lastRow[lastRow.length - 1];
  }

  function getSolution(row,cap){
    const NO_SOLUTION = {maxValue:0, subset:[]};
    // the column number starts from zero.
    var col = cap - 1;
    var lastItem = data[row];
    // console.log(lastItem)
    // The remaining capacity for the sub-problem to solve.
    var remaining = cap - data[row].fields.nf_calories;
    // console.log(remaining)
    
    // console.log(row)
    // Refer to the last solution for this capacity,
    // which is in the cell of the previous row with the same column
    var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
    // Refer to the last solution for the remaining capacity,
    // which is in the cell of the previous row with the corresponding column
    var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;

    // If any one of the items weights greater than the 'cap', return the last solution
    if(remaining < 0){
      return lastSolution;
    }

    // console.log(lastSolution)

    // Compare the current best solution for the sub-problem with a specific capacity
    // to a new solution trial with the lastItem(new item) added
    var lastValue = lastSolution.maxValue;
    var lastSubValue = lastSubSolution.maxValue;

    var newValue = lastSubValue + lastItem.fields.nf_calories;
    if(newValue >= lastValue){
      // copy the subset of the last sub-problem solution
      var _lastSubSet = lastSubSolution.subset.slice();
      _lastSubSet.push(lastItem);
      return {maxValue: newValue, subset:_lastSubSet};
    }else{
      return lastSolution;
    }
  }
}





function knapsackMoney(data, money){
  // This implementation uses dynamic programming.
  // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
  // which will be later used as the code execution goes on.
  // This is called memoization in programming.
  // The cell will store best solution objects for different capacities and selectable items.
  var memo = [];
  // Filling the sub-problem solutions grid.
  for (var i = 0; i < data.length; i++) {
    // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
    var row = [];
    for (var cap = 1; cap <= money; cap++) {
      // console.log(i, cap)
      row.push(getSolution(i,cap));
    }
    memo.push(row);
  }

  // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
  return(getLast());

  function getLast(){
    var lastRow = memo[memo.length - 1];
    return lastRow[lastRow.length - 1];
  }

  function getSolution(row,cap){
    const NO_SOLUTION = {maxValue:0.0, subset:[]};
    // the column number starts from zero.
    var col = cap - 1;
    var lastItem = data[row];
    // console.log(lastItem)
    // The remaining capacity for the sub-problem to solve.
    var remaining = cap - data[row].fields.price;
    remaining = Math.floor(remaining)
    //3.11
    //4

    // console.log(remaining)
    
    // console.log(row)
    // Refer to the last solution for this capacity,
    // which is in the cell of the previous row with the same column
    var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
    // Refer to the last solution for the remaining capacity,
    // which is in the cell of the previous row with the corresponding column
    // if (remaining - 1)
    var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;

    // If any one of the items weights greater than the 'cap', return the last solution
    if(remaining < 0){
      return lastSolution;
    }

    // console.log(lastSolution)

    // Compare the current best solution for the sub-problem with a specific capacity
    // to a new solution trial with the lastItem(new item) added
    var lastValue = lastSolution.maxValue;
    var lastSubValue = lastSubSolution.maxValue;

    var newValue = lastSubValue + lastItem.fields.price;
    if(newValue >= lastValue){
      // copy the subset of the last sub-problem solution
      var _lastSubSet = lastSubSolution.subset.slice();
      _lastSubSet.push(lastItem);
      return {maxValue: newValue, subset:_lastSubSet};
    }else{
      return lastSolution;
    }
  }
}

// function getFoodItems (amount, calories) {
//   let ans
//   fs.readFile('./caloriesprice.json', 'utf8', function (err, data) {
//     if (err) throw err;
//       dataParse = JSON.parse(data);
//       ans = knapsackCalorie(dataParse, calories)
//       // console.log(ans.subset)
  
//       setTimeout(() => {
//         ans = knapsackMoney(ans.subset, amount)
//         // console.log(ans.subset)
//         return ans.subset
//       })
//   });
// }

function getFoodItems(amount, calories) {
  return new Promise(function(resolve, reject) {
    let ans
    fs.readFile('./caloriesprice.json', 'utf8', function (err, data) {
      if (err) return reject(err);
        dataParse = JSON.parse(data);

        // console.log(amount, calories)

        ans = knapsackCalorie(dataParse, calories)
        // console.log(ans.subset)s
    
        setTimeout(() => {
          ans = knapsackMoney(ans.subset, amount)
          // console.log(ans.subset)
          // return ans.subset
          resolve(ans.subset), 2000
        })
    });
  });
}




module.exports = {
  getFoodItems: getFoodItems
}


// getFoodItems(8, 3000)
