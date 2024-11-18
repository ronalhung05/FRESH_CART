$(document).ready(function () {
    let rowIndex = 0; // Initialize row index
    const originalProductMap = {}; // Map to store original product list with order

    // Save original product list on page load into a map
    $("#productSelect option").each(function (index) {
        originalProductMap[$(this).val()] = {
            id: $(this).val(),
            name: $(this).text(),
            order: index // Keep track of the original order
        };
    });

    // Open modal on button click
    $("#addProductBtn").on("click", function () {
        $("#addProductModal").modal('show');
    });

    // Input validation for product amount and cost
    $("#productAmount").on("input", function () {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(1);
            alert("Amount cannot be negative.");
        }
    });
    $("#productCost").on("input", function () {
        let value = $(this).val();
        if (value < 0) {
            $(this).val(1);
            alert("Cost cannot be negative.");
        }
    });

    // Save new product logic
    $("#saveProductBtn").on("click", function () {
        const selectedProductId = $("#productSelect").val();
        const selectedProductName = $("#productSelect option:selected").text();
        const productAmount = $("#productAmount").val();
        const productCost = $("#productCost").val();
        const productUnit = $("#productUnit").val();

        if (selectedProductId && productAmount && productCost) {
            // Check if product is already in the table (to prevent duplicates)
            if ($(`#productTableBody tr td:first-child:contains(${selectedProductId})`).length > 0) {
                alert("This product is already added. Please delete it first if you want to add it again.");
                return;
            }

            // Calculate total cost
            const totalCost = parseFloat(productAmount) * parseFloat(productCost);

            // Create a new row for the selected product
            const newRow = `
                <tr data-row-index="${rowIndex}">
                    <td>${selectedProductId}</td>
                    <td>${selectedProductName}</td>
                    <td>${productAmount}</td>
                    <td>${productCost}</td>
                    <td>${totalCost.toFixed(2)}</td>
                    <td>${productUnit}</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm delete-btn" data-row-index="${rowIndex}" 
                        data-product-id="${selectedProductId}" 
                        data-product-name="${selectedProductName}">Delete</button>
                    </td>
                </tr>
            `;
            $("#productTableBody").append(newRow);

            // Add hidden inputs for form submission
            const hiddenInputs = `
                <div id="hiddenInputs-${rowIndex}">
                    <input type="hidden" name="productIds" value="${selectedProductId}" />
                    <input type="hidden" name="productAmounts" value="${productAmount}" />
                    <input type="hidden" name="productCosts" value="${productCost}" />
                </div>
            `;
            $("#hiddenInputsContainer").append(hiddenInputs);

            // Remove the selected option from the dropdown
            $(`#productSelect option[value="${selectedProductId}"]`).remove();

            // Increment row index
            rowIndex++;

            // Close modal and reset modal form inputs
            $("#addProductModal").modal('hide');
            $("#productSelect").val('');
            $("#productAmount").val(1);
            $("#productCost").val(1.0);
        } else {
            alert("Please fill in all required fields.");
        }
    });

    // Delete product logic with reinsertion in correct position using map
    $("#productTableBody").on("click", ".delete-btn", function () {
        const indexToDelete = $(this).data("row-index");
        const productIdToReAdd = $(this).data("product-id");

        // Remove the table row with the matching index
        $(`tr[data-row-index="${indexToDelete}"]`).remove();

        // Remove associated hidden inputs
        $(`#hiddenInputs-${indexToDelete}`).remove();

        // Use the originalProductMap to find the original order and reinsert
        if (originalProductMap[productIdToReAdd]) {
            const productToReAdd = originalProductMap[productIdToReAdd];
            const newOption = `<option value="${productToReAdd.id}">${productToReAdd.name}</option>`;

            // Insert at the correct position based on the original order
            const options = $("#productSelect option");
            let inserted = false;
            for (let i = 0; i < options.length; i++) {
                if (originalProductMap[$(options[i]).val()].order > productToReAdd.order) {
                    $(options[i]).before(newOption);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                // If not inserted, add at the end
                $("#productSelect").append(newOption);
            }
        }
    });

    // Cancel button logic
    $("#buttonCancel").on("click", function () {
        window.history.back();
    });

    // Form submission check
    $("form").on("submit", function (event) {
        if ($("#productTableBody tr").length === 0) {
            alert("Please add at least one product before saving.");
            event.preventDefault(); // Prevent form submission
        }
    });
});
