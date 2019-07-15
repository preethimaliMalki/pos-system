var row;

function addItem() {
    var iid = $('#iid').val();
    var name = $('#name').val();
    var qty = $('#qty').val();
    var price = $('#price').val();

    $('#table').append(
    "<tr onclick='setIndex(this)' >\n"+
        "<td >"+iid+"</td>\n"+
        "<td>"+name+"</td>\n"+
        "<td>"+qty+"</td>\n"+
        "<td>"+price+"</td>\n"+
        "</tr>"
    );

    $('#iid').val('');
    $('#name').val('');
    $('#qty').val('');
    $('#price').val('');
}

function selectedRowToInput() {
    var x = $(row).children('td');
    $('#iid').val($(x[0]).text());
    $('#name').val($(x[1]).text());
    $('#qty').val($(x[2]).text());
    $('#price').val($(x[3]).text());
}
function editItem() {
    var iid = $('#iid').val();
    var name = $('#name').val();
    var qty = $('#qty').val();
    var price = $('#price').val();

    $(row).find("td:eq(0)").text(iid);
    $(row).find("td:eq(1)").text(name);
    $(row).find("td:eq(2)").text(qty);
    $(row).find("td:eq(3)").text(price);

    $('#iid').val('');
    $('#name').val('');
    $('#qty').val('');
    $('#price').val('');
}

function deleteItem() {
    row.remove();

    $('#iid').val('');
    $('#name').val('');
    $('#qty').val('');
    $('#price').val('');
}

function setIndex(x) {
    row = $(x);
    selectedRowToInput();
}