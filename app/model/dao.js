function DAO() {

	this.db = null;

	var dbase = "ts2k";
	
	var sqlCreateTable = "CREATE TABLE IF NOT EXISTS ts2k ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'month_set' INTEGER, 'year_set' INTEGER, 'char_set' INTEGER, 'slot_a' VARCHAR(10), 'slot_b' VARCHAR(10), 'slot_c' VARCHAR(10)); GO;";
	
	var sqlFirstInsert = "INSERT INTO ts2k ('month_set','year_set','char_set','slot_a','slot_b','slot_c') VALUES(1,1,1,'month','day','year'); GO;";
	
	var sqlCheckAll = "SELECT * FROM ts2k; GO;";
	
	var sqlExtractAll = null;
	
	this.init = function(){
		
		this.db = openDatabase(dbase, "", dbase);
		
		this.db.transaction((function (inTransaction) {
      		inTransaction.executeSql(sqlCreateTable, [], 
      		function(){}, 
      		dao.errorHandler);
      		inTransaction.executeSql(sqlCheckAll, [], 
      		dao.firstInsertHandler, 
      		dao.errorHandler);
      		inTransaction.executeSql(sqlCheckAll, [], 
      		dao.takeAll, 
      		dao.errorHandler);   
    	}));

		Mojo.Log.info('*********** db ts2k created *************');
	};
	this.firstInsertHandler = function(inTransaction,results){
		
		if(results.rows.length == 0){
			dao.db.transaction((function (transaction) {
	      		transaction.executeSql(sqlFirstInsert, [], 
	      		function(transaction,results){ helper.molog("first insertion complete"); }, 
	      		dao.errorHandler);
			}));
		} else {
			helper.molog("one too many rows, pass.");
		}								
	};
	this.errorHandler = function(inTransaction, inError){	
		Mojo.Controller.errorDialog("Dao error - (" + inError.code + ") : " + inError.message);	
	};
	this.errorDBHandler = function(inTransaction, inError){	
		//Mojo.Controller.errorDialog("DB error - (" + inError.code + ") : " + inError.message);
		Mojo.Controller.stageController.popScene();	
	};		
};

var dao = new DAO();