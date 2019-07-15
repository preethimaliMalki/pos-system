
function setToday() {
    var today = new Date();
    // Just need to parse the format that you need
    var formattedDate = today.format("yyyy-mm-dd");
    $("#lblOrderDate").text(formattedDate);
}

setToday();

var ordersDetails = [];

$(document).ready(function () {

    for (var i = 0; i < CUSTOMERS.length; i++) {
        $("#cmbCustomerID").append('<option value="' + CUSTOMERS[i].id + '">' + CUSTOMERS[i].id + '</option>')
    }

    for (var i = 0; i < ITEMS.length; i++) {
        $("#cmbItemCode").append('<option value="' + ITEMS[i].code + '">' + ITEMS[i].code + '</option>')
    }

    reset();

});

function findCustomer(customerId) {
    for (var index in CUSTOMERS) {
        var customer = CUSTOMERS[index];
        if (customer.id == customerId) {
            return customer;
        }
    }
}

function findItem(itemCode) {
    for (var index in ITEMS) {
        var item = ITEMS[index];
        if (item.code == itemCode) {
            return item;
        }
    }
}

$("#btnNewOrder").click(function () {

    $("#tblOrderDetails tbody tr").each(function () {
        var itemCode = $(this).find("td:first-child").text().trim();
        var qty = parseInt($(this).find('td:nth-child(4)').text().trim());
        var item = findItem(itemCode);
        item.qtyOnHand += qty;
    });

    reset();

    var lastOrderId = $("#tblOrders tbody tr:last-child td:first-child").text();
    var orderId = 1;
    if (lastOrderId) {
        orderId = parseInt(lastOrderId) + 1;
    }
    $("#lblOrderId").text(orderId);

    $("#cmbCustomerID").attr("disabled", false);
    $("#cmbItemCode").attr("disabled", false);
    $("#btnAddCart").attr("disabled", false);
    $("#txtQty").attr("disabled", false);
    $("#btnPlaceOrder").attr("disabled", false);
});

$("#cmbCustomerID").change(function () {
    var customerId = $(this).val();
    if (!customerId) {
        customerName = "";
    } else {
        var customerName = findCustomer(customerId).name;
    }
    $("#lblCustomerName").text(customerName);
});

$("#cmbItemCode").change(function () {
    var itemCode = $(this).val();
    if (itemCode) {
        var item = findItem(itemCode);
        $("#lblItemDescription").text(item.description);
        $("#lblUnitPrice").text(item.unitPrice);
        $("#lblQtyOnHand").text(item.qtyOnHand);
    } else {
        $("#lblItemDescription").text("");
        $("#lblUnitPrice").text("");
        $("#lblQtyOnHand").text("");
        $("#txtQty").val("");
    }
});

$("#btnAddCart").click(function () {

    var itemCode = $("#cmbItemCode").val();
    var itemDescription = $("#lblItemDescription").text();
    var unitPrice = parseFloat($("#lblUnitPrice").text());
    var qty = parseInt($("#txtQty").val());
    var total = unitPrice * qty;
    var item = findItem(itemCode);

    if (qty <= 0 || qty > item.qtyOnHand) {
        alert("Invalid Qty");
        $("#txtQty").addClass('invalid-qty');
        return;
    }

    $("#txtQty").removeClass('invalid-qty');

    var currentRow = isItemExists(itemCode);

    // Determines whether I want to update or add
    if ($("#btnAddCart").text().trim() == "Update Cart") {
        // Update
        var currentQty = parseInt($(currentRow).find("td:nth-child(4)").text());
        item.qtyOnHand += currentQty;
        $(currentRow).find("td:nth-child(4)").text(qty);
        $(currentRow).find("td:nth-child(5)").text(total);
        calculateTotal();

        item.qtyOnHand -= qty;
        $("#btnAddCart").html('<i class="fas fa-cart-plus"></i> Add to Cart');
        $("#cmbItemCode").val("").trigger("change");
        $("#cmbItemCode").attr("disabled", false);
        // $("#txtQty").attr("disabled",false);

        return;
    }


    if (currentRow) {
        var currentQty = parseInt($(currentRow).find("td:nth-child(4)").text());
        currentQty += qty;
        total = unitPrice * currentQty;
        $(currentRow).find("td:nth-child(4)").text(currentQty);
        $(currentRow).find("td:nth-child(5)").text(total);
        calculateTotal();

        item.qtyOnHand -= qty;
        $("#cmbItemCode").val("").trigger("change");

        return;
    }

    var html = `<tr>
                            <td class="text-center">${itemCode}</td>
                            <td>${itemDescription}</td>
                            <td class="text-right">${unitPrice}</td>
                            <td class="text-center">${qty}</td>
                            <td class="text-right">${total}</td>
                            <td><div class="icon-delete"></div></td>
                        </tr>`;

    item.qtyOnHand -= qty;
    $("#tblOrderDetails tbody").append(html);

    calculateTotal();
    $("#cmbItemCode").val("").trigger("change");

    $("#tblOrderDetails tbody tr").off("click");
    $("#tblOrderDetails tbody tr").click(function () {
        var itemCode = $(this).find("td:first-child").text();
        var qty = parseInt($(this).find("td:nth-child(4)").text());
        $("#cmbItemCode").val(itemCode).trigger("change");
        $("#txtQty").val(qty);
        $("#btnAddCart").html('<i class="fas fa-cart-plus"></i> Update Cart');
        $("#cmbItemCode").attr("disabled", true);
    });

    $("#tblOrderDetails .icon-delete").off("click");
    $("#tblOrderDetails .icon-delete").click(function (eventData) {
        eventData.stopPropagation();
        if (confirm("Are you sure that you want to delete this item?")) {
            var qty = parseInt($(this).parents("tr").find("td:nth-child(4)").text());
            var itemCode = $(this).parents("tr").find("td:first-child").text();
            var item = findItem(itemCode);
            item.qtyOnHand += qty;

            $(this).fadeOut(500, function () {
                $(this).parents("tr").remove();
                calculateTotal();
            });
        }
    });



});

function isItemExists(code) {
    var flag = null;
    $("#tblOrderDetails tbody tr").each(function () {
        var itemCode = $(this).find("td:first-child").text();
        if (itemCode == code) {
            flag = this;
            return;
        }
    });
    return flag;
}

function calculateTotal() {
    var total = 0.0;
    $("#tblOrderDetails tbody tr").each(function () {
        total += parseFloat($(this).find("td:nth-child(5)").text());
    });
    $("#lblTotal").text(total);
}

$("#btnPlaceOrder").click(function () {

    var rowCount = $("#tblOrderDetails tbody tr").length;
    if (rowCount == 0) {
        alert("In order to place an order there should be at least one order detail");
        return;
    }

    var orderId = $("#lblOrderId").text().trim();
    var orderDate = $("#lblOrderDate").text().trim();
    var customerId = $("#cmbCustomerID").val();
    var customerName = $("#lblCustomerName").text().trim();
    var orderTotal = $("#lblTotal").text().trim();

    if (!customerId) {
        alert("In order to place an order customer should be selected");
        return;
    }

    $("#tblOrderDetails tbody tr").each(function () {

        var itemCode = $(this).find("td:first-child").text();
        var description = $(this).find("td:nth-child(2)").text();
        var unitPrice = $(this).find("td:nth-child(3)").text();
        var qty = $(this).find("td:nth-child(4)").text();
        var total = $(this).find("td:nth-child(5)").text();

        var orderDetail = {
            orderId: orderId,
            itemCode: itemCode,
            description: description,
            unitPrice: unitPrice,
            qty: qty,
            total: total
        };

        ordersDetails.push(orderDetail);

    });

    var html = `<tr>
                            <td class="text-center">${orderId}</td>
                            <td class="text-center">${orderDate}</td>
                            <td class="text-center">${customerId}</td>
                            <td>${customerName}</td>
                            <td class="text-right">${orderTotal}</td>
                        </tr>`;

    $("#tblOrders tbody").append(html);
    reset();

    $("#tblOrders tbody tr").off("click");
    $("#tblOrders tbody tr").click(function () {
        reset();
        var orderId = $(this).find("td:first-child").text();
        var orderDate = $(this).find("td:nth-child(2)").text();
        var customerId = $(this).find("td:nth-child(3)").text();

        $("#lblOrderId").text(orderId);
        $("#lblOrderDate").text(orderDate);
        $("#cmbCustomerID").val(customerId).trigger("change");

        var orderDetails = ordersDetails.filter(function (element) {
            return element.orderId == orderId;
        });

        for (var i = 0; i < orderDetails.length; i++) {
            var html = `<tr>
                                    <td class="text-center">${orderDetails[i].itemCode}</td>
                                    <td>${orderDetails[i].description}</td>
                                    <td class="text-right">${orderDetails[i].unitPrice}</td>
                                    <td class="text-center">${orderDetails[i].qty}</td>
                                    <td class="text-right">${orderDetails[i].total}</td>
                                    <td><div class="icon-delete icon-disabled"></div></td>
                                </tr>`;

            $("#tblOrderDetails tbody").append(html);
        }
        calculateTotal();

        $("#tblOrderDetails tbody tr").click(function () {
            var itemCode = $(this).find("td:first-child").text();
            var qty = parseInt($(this).find("td:nth-child(4)").text());
            $("#cmbItemCode").val(itemCode).trigger("change");
            $("#txtQty").val(qty);
        });

    });

});

function reset() {
    $("#lblOrderId").text("");
    setToday();
    $("#cmbCustomerID").attr("disabled", true);
    $("#cmbItemCode").attr("disabled", true);
    $("#cmbCustomerID").val("").trigger("change");
    $("#cmbItemCode").val("").trigger("change");
    $("#txtQty").val("");
    $("#txtQty").attr("disabled", true);
    $("#btnAddCart").attr("disabled", true);
    $("#tblOrderDetails tbody tr").remove();
    $("#lblTotal").text("0");
    $("#btnPlaceOrder").attr("disabled", true);
}
