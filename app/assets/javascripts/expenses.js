$(document).ready(function(){
   //loads only on the groups show page
  if(window.location.href.indexOf("groups") > -1){
   loadExpenses();
  }
  attachExpenseListeners()
}) //end of document ready

function attachExpenseListeners(){
  //Submits new expenses
 $("form.new_expense").on("submit", function(event) {
   event.preventDefault();
   $.ajax({
     type: "POST",
     url: this.action,
     data: $(this).serialize(), //either JSON or querystring serializing
     success: function(response) {
       // empties the input after successful action
       emptyInput();
       //create new instance of expense model
       let expense = new Expense(response);
       // expense => {id: 211, description: "5 Cents", amount: 0.05, date: "11/25/2018", category_name: "Gifts", …}
       expense.addExpenseHtml();
       //adds the newly created expense to the bottom of the table
       if ($.trim($("div.total").html())==''){
        //if the total is empty, for the first expense
        $("div.total").html(`<h3> TOTAL $${expense.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</h3>`)
        } else {
          //updates the total amount
          expense.updateTotalHtml();
        } //end of if/else
      } //end of success
    }) //end of ajax
    return false;
  }) //end of submit new expense

  $("#cancel-add-expense").on("click", function(event) {
    emptyInput();
    event.preventDefault();
  }) //end of cancel expense

  $("div.edit-expense").on("click", "#cancel-add-expense", function(event) {
    $(".expense-form-container").show();
    $(".edit-expense").html("");
    event.preventDefault();
  }) //end of cancel edit expense

  //pencil icon - edit expense
  $("div.exp-container").on("click", "a#pencil-icon", function(event) {
    event.preventDefault();
    let $pencilIcon = event.target
    let url = $pencilIcon.href
    $.get(url, function(response){
      $(".expense-form-container").hide();
      $(".edit-expense").html(response)
    }) // end of get call
  }) //end of pencil icon

  $(".wrapper").on("click", "#previous-button", function(event) {
    event.preventDefault();
    let previousId = parseInt($("#previous-button").attr("data-groupid"))-1
    let url = "/groups/" + previousId + ".json"
    let urlSummary = "/groups/" + previousId
    $.get(url, function(json){
      let users = json.users.map(user=> user.id)
      //update group name
      $("#group-name").text(json.name)
      //update the data-group-id for all buttons
      updateGroupId(previousId)
      //remove previous table and total amount
      let $table = $("#groups-exp tbody")
      $table.remove();
      $("div.total").html("");
      updateTableHtml(json)
      //reloads the div group-summary-tables based on the urlSummary
      $("div.group-summary-tables").load(urlSummary + " div.group-summary-tables" );
    }) //end of get call
  }) // end of previous-button

  $(".wrapper").on("click", "#next-button", function(event) {
    event.preventDefault();
    let nextId = parseInt($("#previous-button").attr("data-groupid"))+1
    let url = "/groups/" + nextId + ".json"
    let urlSummary = "/groups/" + nextId
    $.get(url, function(json){
      //update group name
      $("#group-name").text(json.name)
      //update the data-group-id for all buttons
      updateGroupId(nextId)
      //remove previous table and total amount
      let $table = $("#groups-exp tbody")
      $table.remove();
      $("div.total").html("");
      updateTableHtml(json)
      $("div.group-summary-tables").load(urlSummary + " div.group-summary-tables" );
    }) //end of get call
  }) // end of next-button

} //end of attachExpenseListeners

function loadExpenses(){
    let url = this.location.href
    url += ".json"
    // "http://localhost:3000/groups/4"
    $.get(url, function(json){
      updateTableHtml(json)
    })
} //end of loadExpenses

function updateTableHtml(json){
  let amount = "";
  let total = 0;
  let groupId = json.id
  let groupExpenses = json.expenses
  //iterate over each expense within json
  if (groupExpenses.length) {
    //checks if the json array is empty
    groupExpenses.forEach(function(expense){
      // expense => {id: 210, description: "5", amount: 5, created_at: "2018-11-26T03:57:56.291Z", category: {…}, …}amount: 5category: {name: "Gifts"}created_at: "2018-11-26T03:57:56.291Z"description: "5"group: {id: 159, name: "5"}id: 210__proto__: Object
      let $table = $("#groups-exp")
      let trHTML = `<tr>
                  <td>${expense.description}</td><td> $ ${expense.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</td>
                  <td>${formatDate(expense.created_at)}</td><td>${expense.category.name}</td>
                  <td><a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${groupId}/expenses/${expense.id}/edit"></td>
                  <td><a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${groupId}/expenses/${expense.id}"></a></td>
                  </tr>`
      $table.append(trHTML)
      amount = parseFloat(expense.amount)
      total += amount
    })
      let totalHTML = `<h3> TOTAL $${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</h3>`
      $("div.total").html($(totalHTML));
    }
  } //end of updateTableHtml

function formatDate(date) {
  const d = new Date(date)
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('/');
} // end of formatDate

function emptyInput() {
  $("#expense_description").val("")
  $("#expense_amount").val("0.00")
  $("#expense_category_name").val("")
}
//end of emptyInput

function updateGroupId(newGroupId){
  //update the data-group-id for all buttons
  $("#group-name").attr("data-groupid", newGroupId)
  $("#previous-button").attr("data-groupid", newGroupId)
  $("#next-button").attr("data-groupid", newGroupId)
  //update groupid for form
  $("form.new_expense").attr("action", "/groups/" + newGroupId + "/expenses")
  //update table groupid
  $("#groups-exp").attr("data-groupid", newGroupId)
  //update group summary
  $("#group-summary-reload").attr("data-groupid", newGroupId)
} //end of UpdateGroupID

class Expense{
  constructor(json) {
    this.id = json.id
    this.description = json.description;
    this.amount = json.amount;
    this.date = formatDate(json.created_at);
    this.category_name = json.category.name;
    this.groupId = json.group.id;
  } //end of constructor

  addExpenseHtml(){
    // adds the newly created expense to bototm of the table
    let trHTML = `<tr>
                <td>${this.description}</td><td> $${this.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</td>
                <td>${this.date}</td><td>${this.category_name}</td>
                <td><a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${this.groupId}/expenses/${this.id}/edit"></td>
                <td><a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${this.groupId}/expenses/${this.id}"></a></td>
                </tr>`;
    $("#groups-exp").append(trHTML)
  } //end of prototype addExpenseHtml

  updateTotalHtml(){
    // updates the total amount
    let $total = $("div.total")
    let currentTotal = Number($("div.total").text().replace(/[^0-9.-]+/g,""))
    let amount = this.amount;
    let total = currentTotal + this.amount;

    total = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    let totalHTML = `<h3>TOTAL $${total}</h3>`
    $total.html($(totalHTML));
  } //end of prototype updateTotalHtml

} //end of class Expense
