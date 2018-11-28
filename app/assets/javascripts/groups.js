$(document).ready(function(){
  createGroup();
  attachGroupListeners();
  loadAllGroups();
})
//end of document ready

function loadAllGroups(){
  $.get("/group_list.json", function(json){
    json.map(group => {
      if(group.status === 0){
        group.status = "Active"
      } else {
        group.status = "Inactive"
      }
      trHtml = "";
      trHtml += '<tr><td><a href="/groups/' + group.id + '">' + group.name + '</a></td>'
      trHtml +='<td>' + group.users[0].username + '</td>'
      trHtml +='<td>' + group.memberships_count + '</td>'
      trHtml +='<td>' + group.status + '</td>'
      trHtml +='<td><a class="glyphicon glyphicon-eye-open" id="eye-icon-group-info" href="/groups/' + group.id + '"></a></td></tr>'
      $("div.group-list-table table").append(trHtml)
    })
    //end of map
  })
  //end of get call
}
//end of loadAllGroups

function createGroup(){
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
          //creates new instance of our group model
          let group = new Group(response)
          // add newly created group to the top of the table
          group.addGroupHtml()
        }
        //end of if/else
      }
      //end of success
    })
    //end of ajax call
    return false;
  })
}
//end of createGroup

function attachGroupListeners(){
  //clears input on form
   $("#cancel-group").on("click", (event)=> {
    $("#group_name").val("")
    event.preventDefault();
  })
  //end of cancel-group

  $("div.groups-container").on("click", "a#pencil-icon", (event)=> {
    event.preventDefault();
    $("#flash_notice").html("")
    let $pencilIcon = event.target
    let url = $pencilIcon.href
    $.get(url, function(response){
      $(".group-form").hide();
      $(".edit-group").html(response)
    })
    // end of get call
  })
  //end of pencil icon

  //hide/show inactive groups table
  $("#inactive-group-btn").on("click", (e)=> {
    $("div.inactive_groups").toggle();
  });

  $("div#group-expenses-page").on("click", "#group-summary-reload", (e)=> {
    let groupId = parseInt($("#group-summary-reload").attr("data-groupid"))
    let url = "/groups/" + groupId
    $("div.group-summary-tables").load(url + " div.group-summary-tables" );
  });
  //end of group-summary reload

  //groups index page view button
  $("div.group-list-table").on("click", "#eye-icon-group-info", (e)=> {
    let url = event.target.href + ".json"
    let $div = $("div.group-info")
    let $ol = $("div.group-info ol")
    let total = 0;
    $div.show()
    $div.html("")
    // "http://localhost:3000/groups/31.json"
    $.get(url, function(json){
      let infoHtml = "";
      let users = json.users
      let expenses = json.expenses
      infoHtml += '<h3> GROUP: ' + json.name + '</h3>'
      infoHtml += '<h5> Group Members: </h5>'
      $div.append(infoHtml)

      users.forEach(function(user){
        $div.append("<li>" + user.username + "</li>")
      })

      $div.append('<p> Total Expenses in this group: ' + expenses.length + '</p>')

      expenses.forEach(function(expense){
        let amount = parseFloat(expense.amount)
        total += amount
      })
      $div.append("<p> TOTAL: $" + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + "</p>")
    })
    e.preventDefault();
    //end of get call
  })
  //end of eye-icon-group

  $("a#most-popular").on("click", function(e){
    let url = this.href + ".json"
    $.get(url, function(response){
      let $table = $("#groups tbody")
      $table.remove();
      let sortByPopularity = response.sort(function(a, b) {
        var groupA = a.memberships_count
        var groupB = b.memberships_count
        if(groupA > groupB){
          return -1;
        }
        if (groupA < groupB) {
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
        trHtml = "";
        trHtml += '<tr><td><a href="/groups/' + group.id + '">' + group.name + '</a></td>'
        trHtml +='<td>' + group.users[0].username + '</td>'
        trHtml +='<td>' + group.memberships_count + '</td>'
        trHtml +='<td>' + group.status + '</td>'
        trHtml +='<td><a class="glyphicon glyphicon-eye-open" id="eye-icon-group-info" href="/groups/' + group.id + '"></a></td></tr>'
        $("div.group-list-table table").append(trHtml)
      })
      //end of map
    })
    //end of get call
    e.preventDefault();
  })
  //end of most-popular


}
//end of attachGroupListeners

class Group {
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    if (json.status === 0){
      this.status = "Active"
    } else {
      this.status = "Inactive"
    }
    //end of if/else
  }
  //end of constructor

  //Sets a method on object prototype
  addGroupHtml(){
      // adds the newly created group to top of the table
      let trHTML = "";
          trHTML += '<tr><td>' + this.name + '</td><td>' + this.status + '</td>'
          trHTML += '<td>' + `<a class="glyphicon glyphicon-eye-open" id="eye-icon" href="/groups/${this.id}"></a>` + '</td>'
          trHTML += '<td>' + `<a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${this.id}/edit">` +  '</td>'
          trHTML += '<td>' + `<a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${this.id}"></a>` + '</td></tr>'
      if (this.status === "Active") {
        $("div.active_groups table").prepend(trHTML)
      } else {
        $("div.inactive_groups table").prepend(trHTML)
      }
      //end of if else
    }
    //end of prototype addGroupHtml
}
//end of class Group
