// Delete

function deleteData(elem){
  var fileid = $(elem).attr('data-id');
  console.log(fileid);
  console.log(".box_"+fileid);

  swal({
    title: "Are you sure?",
    text: "You Want To Delete This Record.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
       swal({
            title: "Success!",
            text: "Your Record Deleted Successfully",
            icon: "success",
            html: true,
            type: "success"
            });
      

    } else {
      swal("Your Record is Safe", {
        icon: "success",
      });
    }
  });
}

// Edit

function updateData(elem){
  var fileid = $(elem).attr('data-id');
  console.log(fileid);
  console.log(".box_"+fileid);

  swal({
    title: "Are you sure?",
    text: "You Want To Update This Record.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
       swal({
            title: "Success!",
            text: "Your Record Updated Successfully",
            icon: "success",
            html: true,
            type: "success"
            });
      

    } else {
      swal("Your Record is Updated", {
        icon: "success",
      });
    }
  });
}


// Active

function statusData(elem){
  var fileid = $(elem).attr('data-id');
  console.log(fileid);
  console.log(".box_"+fileid);
  swal("Good job!", "You Are Successfully Activated", "success");
}

// Pending active

function pendingacptData(elem){
  var fileid = $(elem).attr('data-id');
  console.log(fileid);
  console.log(".box_"+fileid);

  swal({
    title: "Are you sure You Want to approve ?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
       swal({
            title: "Success!",
            text: "Order Approved Successfully",
            icon: "success",
            html: true,
            type: "success"
            });
      

    } else {
      swal("You Have Cancel To Approved This order", {
        icon: "success",
      });
    }
  });
}

// Pending active

function pendingdenyData(elem){
  var fileid = $(elem).attr('data-id');
  console.log(fileid);
  console.log(".box_"+fileid);

  swal({
    title: "Are you sure You Want to Reject The Order ?",
    text: "",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
       swal({
            title: "Success!",
            text: "Order Rejected Successfully",
            icon: "success",
            html: true,
            type: "success"
            });
      

    } else {
      swal("You have not taken any action", {
        icon: "success",
      });
    }
  });
}


// Hide Show Buttton



$(".active-btn-1").click(function() {
  
   var lable = $(".active-btn-1").text().trim();

   if(lable == "Hide") {
     $(".active-btn-1").text("Active");
     $(".myText").hide();
   }
   else {
     $(".active-btn-1").text("Inactive");
     $(".myText").show();
   }
    
  });

$(".active-btn-2").click(function() {
  
   var lable = $(".active-btn-2").text().trim();

   if(lable == "Hide") {
     $(".active-btn-2").text("Active");
     $(".myText").hide();
   }
   else {
     $(".active-btn-2").text("Inactive");
     $(".myText").show();
   }
    
  });

$(".active-btn-3").click(function() {
  
   var lable = $(".active-btn-3").text().trim();

   if(lable == "Hide") {
     $(".active-btn-3").text("Active");
     $(".myText").hide();
   }
   else {
     $(".active-btn-3").text("Inactive");
     $(".myText").show();
   }
    
  });

$(".active-btn-4").click(function() {
  
   var lable = $(".active-btn-4").text().trim();

   if(lable == "Hide") {
     $(".active-btn-4").text("Active");
     $(".myText").hide();
   }
   else {
     $(".active-btn-4").text("Inactive");
     $(".myText").show();
   }
    
  });

$(".active-btn-5").click(function() {
  
   var lable = $(".active-btn-5").text().trim();

   if(lable == "Hide") {
     $(".active-btn-5").text("Active");
     $(".myText").hide();
   }
   else {
     $(".active-btn-5").text("Inactive");
     $(".myText").show();
   }
    
  });




//  Added Theme Custom Js

$(document).ready(function() {
  $('form').parsley();
});
$(function () {
    $('#demo-form').parsley().on('field:validated', function () {
        var ok = $('.parsley-error').length === 0;
        $('.alert-info').toggleClass('d-none', !ok);
        $('.alert-warning').toggleClass('d-none', ok);
    })
    .on('form:submit', function () {
        return false; // Don't submit form for this demo
    });
});

// Responsive Menu Hide Show
var resizefunc = []; 



//Manage Brand
$(document).ready(function () {
  $('#datatable').dataTable();
  $('#datatable-keytable').DataTable({keys: true});
  $('#datatable-responsive').DataTable();
  $('#datatable-colvid').DataTable({
      "dom": 'C<"clear">lfrtip',
      "colVis": {
          "buttonText": "Change columns"
      }
  });
  $('#datatable-scroller').DataTable({
      ajax: "../plugins/datatables/json/scroller-demo.json",
      deferRender: true,
      scrollY: 380,
      scrollCollapse: true,
      scroller: true
  });
  var table = $('#datatable-fixed-header').DataTable({fixedHeader: true});
  var table = $('#datatable-fixed-col').DataTable({
      scrollY: "300px",
      scrollX: true,
      scrollCollapse: true,
      paging: false,
      fixedColumns: {
          leftColumns: 1,
          rightColumns: 1
      }
  });
});
TableManageButtons.init();


$('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
$('#reportrange').daterangepicker({
    format: 'MM/DD/YYYY',
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: '12/31/2016',
    dateLimit: {
        days: 60
    },
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'left',
    drops: 'down',
    buttonClasses: ['btn', 'btn-sm'],
    applyClass: 'btn-success',
    cancelClass: 'btn-default',
    separator: ' to ',
    locale: {
        applyLabel: 'Submit',
        cancelLabel: 'Cancel',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
    }
}, function (start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
});


// Auto Price
jQuery(function($) {
      $('.autonumber').autoNumeric('init');
  });


// About us Editor
$(document).ready(function () {
  if($("#elm1").length > 0){
      tinymce.init({
          selector: "textarea#elm1",
          theme: "modern",
          height:300,
          plugins: [
              "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
              "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
              "save table contextmenu directionality emoticons template paste textcolor"
          ],
          toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | l      ink image | print preview media fullpage | forecolor backcolor emoticons",
          style_formats: [
              {title: 'Bold text', inline: 'b'},
              {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
              {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
              {title: 'Example 1', inline: 'span', classes: 'example1'},
              {title: 'Example 2', inline: 'span', classes: 'example2'},
              {title: 'Table styles'},
              {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
          ]
      });
  }
});