function initializeDataTable(tableId) {
    $(document).ready(function() {
        $('#' + tableId).DataTable({
            // Cấu hình cơ bản
            ordering: true,
            info: true,
            responsive: true,
            lengthChange: false,
            pageLength: 10,

            // Cấu hình layout
            dom: '<"row mb-3"<"col-sm-6"B><"col-sm-6"f>>' +
                '<"row"<"col-sm-12"tr>>' +
                '<"row mt-3"<"col-sm-6"i><"col-sm-6"p>>',

            // Thêm các nút export
            buttons: [
                {
                    extend: 'excel',
                    className: 'btn btn-export me-2',
                    text: '<i class="bi bi-file-earmark-excel"></i>',
                    titleAttr: 'Export to Excel',
                    exportOptions: {
                        columns: [0, 2, 3, 4],
                        format: {
                            body: function(data, row, column) {
                                if (column === 2) {
                                    let temp = document.createElement('div');
                                    temp.innerHTML = data;
                                    return temp.textContent || temp.innerText;
                                }
                                if (column === 4) {
                                    return data.includes('checked') ? 'Enabled' : 'Disabled';
                                }
                                return data;
                            }
                        }
                    }
                },
                {
                    extend: 'csv',
                    className: 'btn btn-export me-2',
                    text: '<i class="bi bi-file-earmark-spreadsheet"></i>',
                    titleAttr: 'Export to CSV',
                    exportOptions: {
                        columns: [0, 2, 3, 4],
                        format: {
                            body: function(data, row, column) {
                                if (column === 2) {
                                    let temp = document.createElement('div');
                                    temp.innerHTML = data;
                                    return temp.textContent || temp.innerText;
                                }
                                if (column === 4) {
                                    return data.includes('checked') ? 'Enabled' : 'Disabled';
                                }
                                return data;
                            }
                        }
                    }
                },
                {
                    extend: 'pdf',
                    className: 'btn btn-export',
                    text: '<i class="bi bi-file-earmark-pdf"></i>',
                    titleAttr: 'Export to PDF',
                    exportOptions: {
                        columns: [0, 2, 3, 4],
                        format: {
                            body: function(data, row, column) {
                                if (column === 2) {
                                    let temp = document.createElement('div');
                                    temp.innerHTML = data;
                                    return temp.textContent || temp.innerText;
                                }
                                if (column === 4) {
                                    return data.includes('checked') ? 'Enabled' : 'Disabled';
                                }
                                return data;
                            }
                        }
                    }
                }
            ],

            // Tùy chỉnh ngôn ngữ
            language: {
                search: "Search Categories:",
                info: "Showing _START_ to _END_ of _TOTAL_ categories",
                paginate: {
                    first: '<i class="bi bi-chevron-double-left"></i>',
                    previous: '<i class="bi bi-chevron-left"></i>',
                    next: '<i class="bi bi-chevron-right"></i>',
                    last: '<i class="bi bi-chevron-double-right"></i>'
                }
            }
        });
    });
}