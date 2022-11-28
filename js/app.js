$(document).ready(function(){
    // $('#member_table').dataTable();
});

getTableData();
/**
 * Generating unique ID for new Input
*/
function guid() {
    return parseInt(Date.now() + Math.random());
}

/**
 * Create and Store New Member
 */
function saveMemberInfo() {
    var keys = ['first_name', 'email', 'phone_number'];
    var obj = {};

    keys.forEach(function (item, index) {
        var result = document.getElementById(item).value;
        if (result) {
            obj[item] = result;
        }
    })

    var members = getMembers();

    if (!members.length) {
        $('.show-table-info').addClass('hide');
    }

    if (Object.keys(obj).length) {
        var members = getMembers();
        obj.id = guid();
        members.push(obj);
        var data = JSON.stringify(members);
        localStorage.setItem("members", data);
        clearFields();
        insertIntoTableView(obj, getTotalRowOfTable());
        $('#addnewModal').modal('hide')
    }
}

/**
 * Clear Create New Member Form Data0
 */
function clearFields() {
    $('#input_form')[0].reset();
}

/** 
 * Get All Members already stored into the local storage
*/
function getMembers() {
    var memberRecord = localStorage.getItem("members");
    var members = [];
    if (!memberRecord) {
        return members;
    } else {
        members = JSON.parse(memberRecord);
        return members;
    }
}

/**
 * Populating Table with stored data
 */
function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();

    var searchKeyword = $('#member_search').val();
    var members = getMembers();

    var filteredMembers = members.filter(function (item, index) {
        return item.first_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.phone_number.toLowerCase().includes(searchKeyword.toLowerCase())
    });

    if (!filteredMembers.length) {
        $('.show-table-info').removeClass('hide');
    } else {
        $('.show-table-info').addClass('hide');
    }

    filteredMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}

/**
 * Inserting data into the table of the view
 * 
 * @param {object} item 
 * @param {int} tableIndex 
 */
function insertIntoTableView(item, tableIndex) {
    var table = document.getElementById('member_table');
    var row = table.insertRow();
    // var idCell = row.insertCell(0);
    var firstNameCell = row.insertCell(0);
    // var emailCell = row.insertCell(2);
    // var phone_numberCell = row.insertCell(3);
    // var actionCell = row.insertCell(4);
    
    // idCell.innerHTML = tableIndex;
    firstNameCell.innerHTML = '<button class="btn btn-sm btn-default w-200" onclick="showMemberData(' + item.id + ')">'+ item.first_name+'</button>';
    // emailCell.innerHTML = item.email;
    // phone_numberCell.innerHTML = item.phone_number;
    var guid = item.id;

    // actionCell.innerHTML = '<button class="btn btn-sm btn-default" onclick="showMemberData(' + guid + ')">View</button> ' +
    //     '<button class="btn btn-sm btn-primary" onclick="showEditModal(' + guid + ')">Edit</button> ' +
    //     '<button class="btn btn-sm btn-danger" onclick="showDeleteModal(' + guid + ')">Delete</button>';
}


/**
 * Get Total Row of Table
 */
function getTotalRowOfTable() {
    var table = document.getElementById('member_table');
    return table.rows.length;
}

/**
 * Show Single Member Data into the modal
 * 
 * @param {string} id 
 */
function showMemberData(id) {
    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#show_first_name').val(member.first_name);
    $('#show_email').val(member.email);
    $('#show_phone_number').val(member.phone_number);

    var showContactModal = document.getElementById('show_contact_modal');
    showContactModal.innerHTML = ' <button type="button" class="btn btn-primary" data-dismiss="modal">Contacts</button>' +
        '<button class="btn btn-sm btn-custom" onclick="showEditModal(' + id + ')">Edit</button> ';
       

    $('#showModal').modal();
}


/**
 * Show Edit Modal of a single member
 * 
 * @param {string} id 
 */
function showEditModal(id) {

    $('#showModal').modal('hide');

    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#edit_first_name').val(member.first_name);
    $('#edit_email').val(member.email);
    $('#edit_phone_number').val(member.phone_number);
    $('#member_id').val(id);

    var editContactModal = document.getElementById('edit_contact_modal');
    editContactModal.innerHTML = ' <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button> ' +
        '<button class="btn btn-success">Save</button>';

    var deleteContactModal = document.getElementById('delete_contact_modal');
    deleteContactModal.innerHTML = '<button class="btn btn-danger" onclick="showDeleteModal(' + id + ')">Delete</button>';

    $('#editModal').modal();
}


/**
 * Store Updated Member Data into the storage
*/
function updateMemberData() {

    var allMembers = getMembers();
    var memberId = $('#member_id').val();

    var member = allMembers.find(function (item) {
        return item.id == memberId;
    })

    member.first_name = $('#edit_first_name').val();
    member.email = $('#edit_email').val();
    member.phone_number = $('#edit_phone_number').val();

    var data = JSON.stringify(allMembers);
    localStorage.setItem('members', data);

    $("#member_table").find("tr:not(:first)").remove();
    getTableData();
    $('#editModal').modal('hide')
}

/**
 * Show Delete Confirmation Dialog Modal
 * 
 * @param {int} id 
 */
function showDeleteModal(id) {
    $('#deleted-member-id').val(id);
    $('#deleteDialog').modal();
}

/**
 * Delete single member
*/
function deleteMemberData() {
    var id = $('#deleted-member-id').val();
    var allMembers = getMembers();

    var storageUsers = JSON.parse(localStorage.getItem('members'));

    var newData = [];

    newData = storageUsers.filter(function (item, index) {
        return item.id != id;
    });

    var data = JSON.stringify(newData);

    localStorage.setItem('members', data);
    $("#member_table").find("tr:not(:first)").remove();
    $('#deleteDialog').modal('hide');
    getTableData();

}

/**
 * Sorting table data through type, e.g: first_name, email, last_name etc.
 * 
 * @param {string} type 
 */
function sortBy(type)
{
    var sortkey = type;
    $("#member_table").find("tr:not(:first)").remove();

    var totalClickOfType = parseInt(localStorage.getItem(type));
    if(!totalClickOfType) {
        totalClickOfType = 1;
        localStorage.setItem(type, totalClickOfType);
    } else {
        if(totalClickOfType == 1) {
            totalClickOfType = 2;
        } else {
            totalClickOfType = 1;
        }
        localStorage.setItem(type, totalClickOfType);
    }

    var searchKeyword = $('#member_search').val();
    var members = getMembers();
    
    // var sortedMembers = members.sort(function (a, b) {
    //     console.log(a[type])
    //     return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
    // });

    members.sort(function(a,b) {return (a[type] > b[type]) ? 1 : ((b[type] > a[type]) ? -1 : 0);} );

    console.log(members);

    members.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}




var current_page = 1;
var records_per_page = 5;
var l = document.getElementById("member_table").rows.length

function prevPage()
{

    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
    
function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("member_table");
    var page_span = document.getElementById("page");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    [...listing_table.getElementsByTagName('tr')].forEach((tr)=>{
        tr.style.display='none'; // reset all to not display
    });
    listing_table.rows[0].style.display = ""; // display the title row

    for (var i = (page-1) * records_per_page + 1; i < (page * records_per_page) + 1; i++) {
        if (listing_table.rows[i]) {
            listing_table.rows[i].style.display = ""
        } else {
            continue;
        }
    }
    
    page_span.innerHTML = page + "/" + numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil((l - 1) / records_per_page);
}

window.onload = function() {
    changePage(current_page);
};