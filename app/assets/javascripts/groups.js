$(document).ready(function(){
  createGroup();
  attachGroupListeners();
})
//end of document ready

function createGroup(){
  $("form.new_group").on("submit", (event)=> {
    event.preventDefault();
    debugger
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

function attachGroupListeners(){

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

}
//end of attachGroupListeners

class Group {
  constructor(json) {
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