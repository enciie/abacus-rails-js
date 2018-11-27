$(document).ready(function(){
   //loads only on the groups show page
  if(window.location.href.indexOf("groups") > -1){
   loadExpenses();
  }
})
//end of document ready

// Loads all expenses

function loadExpenses(){
  debugger
  let url = this.location.href
  // "http://localhost:3000/groups/4"
  url += ".json"
  $.get(url, function(json){
    updateTableHtml(json)
  })
  //end of get call
}
// end of loadExpenses

function updateTableHtml(json){
    let amount = "";
    let total = 0;
    let totalHTML = "";
    let groupId = json.id
    let groupExpenses = json.expenses
    //iterate over each expense within json
    if (groupExpenses.length) {
      //checks if the json array is empty
      groupExpenses.forEach(function(expense){
        // expense => {id: 210, description: "5", amount: 5, created_at: "2018-11-26T03:57:56.291Z", category: {…}, …}amount: 5category: {name: "Gifts"}created_at: "2018-11-26T03:57:56.291Z"description: "5"group: {id: 159, name: "5"}id: 210__proto__: Object
        let $table = $("#groups-exp")
        let trHTML = "";
        trHTML += '<tr><td>' + expense.description + '</td><td> $' + expense.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + '</td><td>'
        trHTML += expense.created_at + '</td><td>' + expense.category.name + '</td>'
        trHTML += '<td>' + `<a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${groupId}/expenses/${expense.id}/edit">` + '</td>'
        trHTML += '<td>' + `<a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${groupId}/expenses/${expense.id}"></a>` + '</td></tr>';
        $table.append(trHTML)
        amount = parseFloat(expense.amount)
        total += amount
      })
        totalHTML += '<h3> TOTAL $' + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + '</h3>'
        $("div.total").html($(totalHTML));
    }
  }
  //end of updateTableHtml
