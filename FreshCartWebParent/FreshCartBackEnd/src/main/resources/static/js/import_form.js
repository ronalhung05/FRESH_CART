$(document).ready(function () {
    let rowIndex = 0; // Initialize row index

    // Open modal on button click
    $("#addProductBtn").on("click", function () {
        $("#addProductModal").modal('show');
    });

    // Input validation for product amount
    $("#productAmount").on("input", function () {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(0);
            alert("Amount cannot be negative.");
        }
    });

    // Input validation for product cost
    $("#productCost").on("input", function () {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(0);
            alert("Cost cannot be negative.");
        }
    });

    // Save new product logic
    $("#saveProductBtn").on("click", function () {
        // Retrieve values from modal inputs
        const selectedProductId = $("#productSelect").val();
        const selectedProductName = $("#productSelect option:selected").text();
        const productAmount = $("#productAmount").val();
        const productCost = $("#productCost").val();
        const productUnit = $("#productUnit").val();

        if (selectedProductId && productAmount && productCost) {
            // Calculate total cost
            const totalCost = parseFloat(productAmount) * parseFloat(productCost);

            // Create a new row with a unique index
            const newRow = `
                <tr data-row-index="${rowIndex}">
                    <td>${selectedProductId}</td>
                    <td>${selectedProductName}</td>
                    <td>${productAmount}</td>
                    <td>${productCost}</td>
                    <td>${totalCost.toFixed(2)}</td>
                    <td>${productUnit}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm delete-btn" data-row-index="${rowIndex}">Delete</button>
                    </td>
                </tr>
            `;
            $("#productTableBody").append(newRow);

            // Create a hidden input container with the same unique index
            const hiddenInputsContainer = $("#hiddenInputsContainer");
            const hiddenDiv = `
                <div id="hiddenInputs-${rowIndex}">
                    <input type="hidden" name="productIds" value="${selectedProductId}" />
                    <input type="hidden" name="productAmounts" value="${productAmount}" />
                    <input type="hidden" name="productCosts" value="${productCost}" />
                </div>
            `;
            hiddenInputsContainer.append(hiddenDiv);

            // Increment the row index for the next row
            rowIndex++;

            // Close modal and reset modal form inputs
            $("#addProductModal").modal('hide');
            $("#productSelect").val('');
            $("#productAmount").val(1);
            $("#productCost").val(1.00);
        } else {
            alert("Please fill in all required fields.");
        }
    });

    // Event delegation for deleting rows and associated hidden inputs
    $("#productTableBody").on("click", ".delete-btn", function () {
        const indexToDelete = $(this).data("row-index");

        // Remove the table row with the matching index
        $(`tr[data-row-index="${indexToDelete}"]`).remove();

        // Remove associated hidden inputs container with the matching index
        $(`#hiddenInputs-${indexToDelete}`).remove();
    });

    // Event listener for "Cancel" button
    $("#buttonCancel").on("click", function () {
        window.history.back();
    });

    // Check for products before form submission
    $("form").on("submit", function (event) {
        if ($("#productTableBody tr").length === 0) {
            alert("Please add at least one product before saving.");
            event.preventDefault(); // Prevent form submission
        }
    });
});
