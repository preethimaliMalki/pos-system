var row;

function addCustomer() {
        var cid = $('#cid').val();
        var namee = $('#name').val();
        var addres = $('#address').val();
        var emaill = $('#email').val();
        var sall = $('#credit').val();
    $('#table').append(
        "<tr onclick='setIndex(this)'>\n" +
        " <td >"+cid+"</td>\n" +
        "<td>"+namee+"</td>\n" +
        "<td>"+addres+"</td>\n" +
        "<td>"+emaill+"</td>\n" +
        "<td>"+sall+"</td>\n" +
        "</tr>");

    $('#cid').val('');
    $('#name').val('');
    $('#address').val('');
    $('#email').val('');
    $('#credit').val('');
    }

function selectedRowToInput() {
    var x=$(row).children('td');
    $("#cid").val($(x[0]).text());
    $("#name").val($(x[1]).text());
    $("#address").val($(x[2]).text());
    $("#email").val($(x[3]).text());
    $("#credit").val($(x[4]).text());
}

function editCustomer() {
    var cid = $('#cid').val();
    var namee = $('#name').val();
    var addres = $('#address').val();
    var emaill = $('#email').val();
    var sall = $('#credit').val();

    $(row).find("td:eq(0)").text(cid);
    $(row).find("td:eq(1)").text(namee);
    $(row).find("td:eq(2)").text(addres);
    $(row).find("td:eq(3)").text(emaill);
    $(row).find("td:eq(4)").text(sall);

    $('#cid').val('');
    $('#name').val('');
    $('#address').val('');
    $('#email').val('');
    $('#credit').val('');
}

function deleteCustomer() {
    row.remove();

    $('#cid').val('');
    $('#name').val('');
    $('#address').val('');
    $('#email').val('');
    $('#credit').val('');
}

function setIndex(x){
    row=$(x);
    selectedRowToInput();
}

