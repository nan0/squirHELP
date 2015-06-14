
/**
 * Created by nan0 on 14/06/15.
 */

var CEComputer = function(){
    this.container={};
    this.headers={};
    this.attachToDom();
}

CEComputer.prototype.attachToDom = function() {

    //Storing an object reference for the listeners...
    var currObj=this;

    //Getting the html tbody
    var table = document.getElementsByClassName('small special msi-table tdBorder')[0];

    this.headers = table.getElementsByTagName('thead')[0].childNodes[0];
    var th = document.createElement('th');
    th.setAttribute('scope','col');

    //Thead
    var checkbox = document.createElement("INPUT");

    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute('id','checkbox_th');
    checkbox.setAttribute('align','center');
    checkbox.addEventListener("change", function() {
        if(toogleCheckAll(this.checked))
            currObj.computeSelected();
    });
    th.appendChild(checkbox);
    this.headers.appendChild(th);

    //Tbody
    this.container = table.getElementsByTagName('tbody')[0];
    for (var i in this.container.childNodes) {
        var tr = this.container.childNodes[i];
        if (tr.tagName == 'TR') { //Only the TRs...
            tr.setAttribute('id','tr_op_'+i);
            var td = document.createElement('td');
            td.setAttribute('id','td_op_comp_'+i);
            td.setAttribute('align','center');
            var checkbox = document.createElement("INPUT");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute('id','checkbox_op_comp_'+i);
            checkbox.setAttribute('class','check_op');
            checkbox.setAttribute('align','center');
            checkbox.addEventListener("change", function() {
                currObj.computeSelected();
            });

            td.appendChild(checkbox);
            tr.appendChild(td);
        }
    }

    var prevElem=document.getElementById('MM_HISTORIQUE_COMPTE_pnlPagination');
    var p = document.createElement('p');
    p.setAttribute('class','solde');
    p.textContent="TOTAL SELECTION"
    var span = document.createElement('span');
    span.setAttribute('id','span_count_selected_result');
    p.appendChild(span);
    prevElem.parentNode.insertBefore(p, prevElem.nextSibling); //Inserting just after the pagination

    this.computeSelected();

};


//Returns the list of account page lines
CEComputer.prototype.getOperations = function() {

    var result = {};

    if (this.container.childNodes.length == 0) {
        alert("No operations in the page !");
    } else {
        //For each line of the table, we build add the info to a simplest array
        for (var i in this.container.childNodes) {
            var tr = this.container.childNodes[i];
            if (tr.tagName == 'TR') { //Only the TRs...

                var checked = tr.childNodes[4].childNodes[0].checked;
                if(checked) { //Excluding the non checked rows
                    //Parsing the date
                    var stringDate = tr.childNodes[0].innerHTML; //Format : DD/MM/YYYY
                    var splitDate = stringDate.split('/');
                    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
                    var date = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]); // Note: months are 0-based

                    //Operation name
                    var operation = tr.childNodes[1].childNodes[0].innerHTML;

                    //Parsing the flow
                    var debit = tr.childNodes[2].innerHTML;
                    var credit = tr.childNodes[3].innerHTML;
                    var stringFlow = (debit == '&nbsp;') ? credit : debit; //Getting the non empty operation
                    var flow = parseFloat(stringFlow.replace(' ', '').replace('€', '').replace(',', '.')); //Removes the spaces and the '€', replace the ',' by '.' for the float parsing

                    //building the array element
                    result[i] = {};
                    result[i].date = date;
                    result[i].operation = operation;
                    result[i].flow = flow;
                }
            }
        }
    }

    return result;
}

CEComputer.prototype.computeSelected = function() {
    var result = 0;
    var positiveString=''
    var rows = this.getOperations();
    for(var i in rows){
        result+=rows[i].flow;
    }

    positiveString = (result>=0)?'+ ':'';

    this.refreshResult(positiveString+parseFloat(result));
}

CEComputer.prototype.refreshResult = function (result){
    var span_res = document.getElementById('span_count_selected_result');
    span_res.textContent = result + ' €';
}

//Non object functions
function toogleCheckAll(checked){

    var checkboxes = document.getElementsByClassName('check_op');
    for (var i in checkboxes) {
        if(checkboxes[i].tagName=='INPUT') {
            checkboxes[i].checked=checked;
        }
    }

    return true;
};


var ceComputer = new CEComputer();

