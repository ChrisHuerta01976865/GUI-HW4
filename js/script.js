/* 
 File: script.js
 GUI Assignment: Dynamic multiplication table
 Christopher Huerta
 11/26/25
here is my scrip which allows me to read the inputs the user puts in as well as validates inputs to see if they work with 
my values as well create the dynamic table for the assingment as well as allowing for saving tables and deleteing them
 */

$(document).ready(function () {


    $("#tabs").tabs();

    //sets up slider rules
    const sliderSettings = {
        min: -50,
        max: 50,
        value: 0,
        //this function allows for two way binding
        slide: function (event, ui) {
            let inputId = $(this).attr("id").replace("slider-","");
            $("#" + inputId).val(ui.value);

            //this checks that the sliders also validate
            if($("#tableForm").valid()) {
                generateTable();
            }
        }
    }
    //initialize sliders
    $("#slider-minCol").slider(sliderSettings);
    $("#slider-maxCol").slider(sliderSettings);
    $("#slider-minRow").slider(sliderSettings);
    $("#slider-maxRow").slider(sliderSettings);

    // Close tabs when the X icon is clicked
    $("#tabs").on("click", ".ui-icon-close", function () {

        const li = $(this).closest("li");
        const panelId = li.attr("aria-controls");
        li.remove();
        $("#" + panelId).remove();
        $("#tabs").tabs("refresh");

        if ($("#tabs ul li").length === 0) return;
        $("#tabs").tabs("option", "active", 0);
    });

    // Delete all tabs that have their checkbox selected
    $("#deleteSelected").on("click", function () {

        // checks all checked tabs to delete
        $(".tab-select-checkbox:checked").each(function () {

            const li = $(this).closest("li");
            const panelId = li.attr("aria-controls");
            // Remove tab and its content
            li.remove();
            $("#" + panelId).remove();
        });
        // Refresh tabs after deleting a tab
        $("#tabs").tabs("refresh");

        // Switch to the first tab
        if ($("#tabs ul li").length > 0) {
            $("#tabs").tabs("option", "active", 0);
        }
    });

    //this connect the input fields to update the sliders as well
    $("#minCol").on("input", function () {
        $("#slider-minCol").slider("value", this.value);
        if ($("#tableForm").valid()) generateTable();
    })

    $("#maxCol").on("input", function () {
        $("#slider-maxCol").slider("value", this.value);
        if ($("#tableForm").valid()) generateTable();
    })

    $("#minRow").on("input", function () {
        $("#slider-minRow").slider("value", this.value);
        if ($("#tableForm").valid()) generateTable();
    })

    $("#maxRow").on("input", function () {
        $("#slider-maxRow").slider("value", this.value);
        if ($("#tableForm").valid()) generateTable();
    })

    //sets up for when an input is less than the other
    $.validator.addMethod("lessEqual", function (value, element, target) {
        return parseInt(value) <= parseInt($(target).val());
    });

    //sets up when input is greater or equal to the other
    $.validator.addMethod("greaterEqual", function (value, element, target) {
        return parseInt(value) >= parseInt($(target).val());
    });

    //sets up the validating rules for input
    $("#tableForm").validate({

        rules: {
            minCol: {
                required: true,
                number: true,
                range: [-50,50],
                lessEqual: "#maxCol"
            },
            maxCol: {
                required: true,
                number: true,
                range: [-50,50],
                greaterEqual: "#minCol"
            },
            minRow: {
                required: true,
                number: true,
                range: [-50,50],
                lessEqual: "#maxRow"
            },
            maxRow: {
                required: true,
                number: true,
                range: [-50,50],
                greaterEqual: "#minRow"
            }
        },

        //messages that appear for each input based off what prompt is needed
        messages: {
            minCol: {
                required: "please enter a number",
                number: "must be a valid number",
                range: "value has to be between -50 and 50",
                lessEqual: "min column must be less than or equal to max column"
            },
            maxCol: {
                required: "please enter a number",
                number: "must be a valid number",
                range: "value has to be between -50 and 50",
                greaterEqual: "max column must be greater than or equal to min column"
            },
            minRow: {
                required: "please enter a number",
                number: "must be a valid number",
                range: "value has to be between -50 and 50",
                lessEqual: "min row must be less than or equal to max row"          
            },
            maxRow: {
                required: "please enter a number",
                number: "must be a valid number",
                range: "value has to be between -50 and 50",
                greaterEqual: "max row must be greater than or equal to min row"  
            }
        },


        errorPosition: function (error, element) {
            error.insertAfter(element);
        },

        errorClass: "is-invalid",
        validClass: "is-valid",

        submitHandler: function () {
            generateTable();

            //grabs inputs from table to save as a tab
            const minCol = $("#minCol").val();
            const maxCol = $("#maxCol").val();
            const minRow = $("#minRow").val();
            const maxRow = $("#maxRow").val();

            //creates tab id
            const tabId = "tabs-" + ($(".ui-tabs-panel").length + 1);

            const tabTitle = `C: ${minCol} to ${maxCol}, R: ${minRow} to ${maxRow}`;

            // Add new tab button and also is what enables deleting tabs
            $("#tabs ul").append(
                `<li>
                    <input type="checkbox" class="tab-select-checkbox">
                    <a href="#${tabId}">${tabTitle}</a>
                    <span class="ui-icon ui-icon-close" role="presentation"></span>
                </li>`
            );

            // Adds new tabs content
            $("#tabs").append(
                `<div id="${tabId}">${$("#tableContainer").html()}</div>`
            );

            // updates tabs to display the new saved one
            $("#tabs").tabs("refresh");

            // switches the tab area to the newly saved tab onces you press enter
            const newIndex = $("#tabs ul li").length - 1;
            $("#tabs").tabs("option", "active", newIndex);

        }
    });


});


//dynamically create table through this function
function generateTable() {
    // getting all input values done this way to handles invalid inputs easier
    const inputs = [
        { id: 'minCol', value: parseInt(document.getElementById('minCol').value) },
        { id: 'maxCol', value: parseInt(document.getElementById('maxCol').value) },
        { id: 'minRow', value: parseInt(document.getElementById('minRow').value) },
        { id: 'maxRow', value: parseInt(document.getElementById('maxRow').value) },
    ];
    const tableContainer = document.getElementById('tableContainer');

    // Clear last table
    tableContainer.innerHTML = "";

    const minCol = inputs[0].value;
    const maxCol = inputs[1].value;
    const minRow = inputs[2].value;
    const maxRow = inputs[3].value;




    // create table elements
    const table = document.createElement('table');
    table.className = "custom-table";
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // top left corner of table
    headerRow.appendChild(document.createElement('th'));

    // Column headers
    for (let col = minCol; col <= maxCol; col++) {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    }

    // adds header row to the table head
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let row = minRow; row <= maxRow; row++) {
        const tr = document.createElement('tr');

        //create for cell in each row
        const rowHeader = document.createElement('th');
        rowHeader.textContent = row;
        tr.appendChild(rowHeader);

        //multiplication cells are made here
        for (let col = minCol; col <= maxCol; col++) {
            const td = document.createElement('td');
            td.textContent = row * col;
            tr.appendChild(td);
        }

        //add the finished row to the table body
        tbody.appendChild(tr);
    }

    //add table body to the table container
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}