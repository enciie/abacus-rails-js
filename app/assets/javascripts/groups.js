$(document).ready(function(){
  createGroup();

})
//end of document ready

function createGroup(){
  $("form.new_group").on("submit", function(event) {
    event.preventDefault();
    debugger
    $.ajax({
      type: "POST",
      url: this.action,
      data: $(this).serialize(),
      success: function(response){
        debugger
        if (response === undefined){
          debugger
          alert("Group Name cant be blank")
        } else {
          //empties the input after successful action
          $("#group_name").val("")
          //creates new instance of our group model
          let group = new Group(response)
          // add newly created group to the top of the table
          let trHTML = "";
          trHTML += '<tr><td>' + group.name + '</td><td>' + group.status + '</td>'
          trHTML += '<td>' + `<a class="glyphicon glyphicon-eye-open" id="eye-icon" href="/groups/${group.id}"></a>` + '</td>'
          trHTML += '<td>' + `<a class="glyphicon glyphicon-pencil" id="pencil-icon" href="/groups/${group.id}/edit">` +  '</td>'
          trHTML += '<td>' + `<a data-confirm="Are you sure?" class="glyphicon glyphicon-trash" id="trash-icon" rel="nofollow" data-method="delete" href="/groups/${group.id}"></a>` + '</td></tr>'
            if (group.status === "Active") {
              $("div.active_groups table").prepend(trHTML)
            } else {
              $("div.inactive_groups table").prepend(trHTML)
            }
            //end of if/else
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

class Group {
  constructor(json) {
    debugger
    this.id = json.id;
    this.name = json.name;
    if (json.status === 0){
      this.status = "Active"
    } else {
      this.status == "Inactive"
    }
    //end of if/else
  }
  //end of constructor
}
//end of class Group
