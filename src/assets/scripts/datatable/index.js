import * as $ from 'jquery';
import 'datatables';

export default (function () {
  $('#dataTable').DataTable();
  $('.table').dataTable().fnAddData( [
		                  ".1",
		                  ".2",
		                  ".3",
		                  ".4" ]
		        );
}());
