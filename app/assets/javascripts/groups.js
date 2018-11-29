$(document).ready(function(){
  createGroup();
  attachGroupListeners();
  if(window.location.href.indexOf("group_list") > -1){
    searchGroup();
    loadAllGroups();
  }
}) //end of document ready

function loadAllGroups(){
  $.get("/group_list.json", function(json){
    json.map(group => {
      if(group.status === 0){
        group.status = "Active"
      } else {
        group.status = "Inactive"
      }
      let trHtml = `<tr><td><a href="/groups/${group.id}">${group.name}</a></td>
               <td>${group.users[0].username}</td>
               <td>${group.memberships_count}</td>
               <td>${group.status}</td>
               <td><a class="glyphicon glyphicon-eye-open" id="eye-icon-group-info" href="/groups/${group.id}"></a></td></tr>`
      $("div.group-list-table table").append(trHtml)
    }) //end of map
  }) //end of get call
} //end of loadAllGroups

function createGroup() {
  $("form.new_group").on("submit", function(event){
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: this.action,
      data: $(this).serialize(),
      success: function(response){
        if (response === undefined){
          alert("Group Name cant be blank")
        } else {
          //empties the input after successful action
          $("#group_name").val("")
          $("div.flash_notice").html("")
          //creates new instance of our group model
          const group = new Group(response)
          // add newly created group to the top of the table
          group.addGroupHtml()
        } //end of if/else
      } //end of success
    })  //end of ajax call
    return false;
  })
} //end of createGroup

function searchGroup() {
  //variable declared, not yet assigned
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("groups");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      } //end of if/else
    }
  }
} //end of searchGroup

function groupInfoHtml(group){
  let $div = $("div.group-info")
  let total = 0;
  let users = group.users
  let expenses = group.expenses
  let infoHtml = `<h3><a href="/groups/${group.id}">${group.name}</a></h3><h5> Group Members: </h5>`
  $div.append(infoHtml)

  users.forEach(function(user){
    $div.append(`<li> ${user.username} </li>`)
  })

  $div.append(`<p> Total Expenses in this group: ${expenses.length}</p>`)

  expenses.forEach(function(expense){
    let amount = parseFloat(expense.amount)
    total += amount
  })
  $div.append(`<p> TOTAL: $ ${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</p>`)
} //end of groupInfoHtml\

function attachGroupListeners(){

  //clears input on form
   $("#cancel-group").on("click", (event)=> {
    $("#group_name").val("")
    event.preventDefault();
  }) //end of cancel-group

  $("div.edit-group").on("click", "#cancel-group", (event)=> {
    $(".group-form").show();
    $(".edit-group").html("");
    event.preventDefault();
  }) //end of cancel edit group

  $("div.groups-container").on("click", "a#pencil-icon", (event)=> {
    event.preventDefault();
    $("#flash_notice").html("")
    let $pencilIcon = event.target
    let url = $pencilIcon.href
    $.get(url, function(response){
      $(".group-form").hide();
      $(".edit-group").html(response)
    }) // end of get call
  }) //end of pencil icon

  //hide/show inactive groups table
  $("#inactive-group-btn").on("click", ()=> {
    $("div.inactive_groups").toggle();
  }); //end of hide/show

  //reloads the group summary with updated info
  $("div#group-expenses-page").on("click", "#group-summary-reload", ()=> {
    let groupId = parseInt($("#group-summary-reload").attr("data-groupid"))
    let url = "/groups/" + groupId
    $("div.group-summary-tables").load(url + " div.group-summary-tables" );
  });  //end of group-summary reload

  //groups index page view button quick view
  $("div.group-list-table").on("click", "#eye-icon-group-info", (event)=> {
    let url = event.target.href
    let $div = $("div.group-info")
    $div.show()
    $div.html("")
    // "http://localhost:3000/groups/31.json"
    $.get(url, function(json){
      groupInfoHtml(json);
    },"JSON") //end of get call
    event.preventDefault();
  })  //end of eye-icon-group

  $("a#most-popular").on("click", (event)=> {
    $.get("/group_list.json", function(response){
      let $table = $("#groups tbody")
      $table.remove();
      $("div.group-info").hide();
      $("#myInput").val("")
      let sortByPopularity = response.sort(function(a, b) {
        let groupA = a.memberships_count
        let groupB = b.memberships_count
        let groupNameA = a.name
        let groupNameB = b.name

        if(groupA > groupB){
          return -1;
        }
        if (groupA < groupB) {
          return 1;
        }
        if(groupNameA < groupNameB){
          return -1;
        }
        if (groupNameA > groupNameB) {
          return 1;
        }
        return 0;
      })
      //end of sort
      sortByPopularity.map(group => {
        //  group = {id: 1, name: "Group 1", status: 0, memberships_count: 2, users: Array(2), …}
        if(group.status === 0){
          group.status = "Active"
        } else {
          group.status = "Inactive"
        }
        let trHtml = `<tr>
                <td><a href="/groups/${group.id}">${group.name}</a></td>
                <td> ${group.users[0].username} </td>
                <td> ${group.memberships_count} </td>
                <td> ${group.status} </td>
                <td><a class="glyphicon glyphicon-eye-open" id="eye-icon-group-info" href="/groups/${group.id} "></a></td>
                </tr>`
        $("div.group-list-table table").append(trHtml)
      }) //end of map
    }) //end of get call
    event.preventDefault();
  }) //end of most-popular

} //end of attachGroupListeners

class Group {
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    if (json.status === 0){
      this.status = "Active"
    } else {
      this.status = "Inactive"
    } //end of if/else
  } //end of constructor

  //Sets an instance method on object prototype
  addGroupHtml(){
      // adds the newly created group to top of the table
      let trHTML = `<tr>
                  <td> ${this.name} </td><td> ${this.status} </td>
                  <td><a class="glyphicon glyphicon-eye-open" id="eye-icon" href="/groups/${this.id}"></a></td>
                  <td><a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${this.id}/edit"></td>
                  <td><a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${this.id}"></a></td>
                  </tr>`
      if (this.status === "Active") {
        $("div.active_groups table").prepend(trHTML)
      } else {
        $("div.inactive_groups table").prepend(trHTML)
      } //end of if else
    } //end of prototype addGroupHtml

} //end of class Group
