import {SQLiteDatabase, enablePromise, openDatabase} from 'react-native-sqlite-storage';

const databaseName = 'FinancialDb';

enablePromise(true);

export const getDBConnection = async() => {
    return openDatabase(
        {name: `${databaseName}`},
        openCallback,
        errorCallback,
    );
}


export const createIncomesTable = async (db: SQLiteDatabase) => {
  try {
      const query = 'CREATE TABLE IF NOT EXISTS Incomes(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), value INTEGER)';
      await db.executeSql(query);
      console.log('Incomes table created successfully');
  } catch (error) {
      console.error('Error creating Incomes table:', error);
      throw Error('Failed to create Incomes table');
  }
};


export const createExpensesTable = async( db: SQLiteDatabase ) => {
    try{
        const query = 'CREATE TABLE IF NOT EXISTS Expenses(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), value INTEGER)';
        await db.executeSql(query);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create table !!!');
      }
}

export const createUsersTable = async( db: SQLiteDatabase ) => {
    try{
        const query = 'CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), email VARCHAR(20), state VARCHAR(20))';
        await db.executeSql(query);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create table !!!');
      }
}

export const getIncomes = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const IncomesData : any = [];
        const query = `SELECT * FROM Incomes ORDER BY name`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                IncomesData.push(item);
            })
          });
        return IncomesData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get Incomes !!!');
      }
}

export const getExpenses = async( db: SQLiteDatabase ): Promise<any> => {
    try{
        const ExpensesData : any = [];
        const query = `SELECT * FROM Expenses ORDER BY name`;
        const results = await db.executeSql(query);
        results.forEach(result => {
            (result.rows.raw()).forEach(( item:any ) => {
                ExpensesData.push(item);
            })
          });
        return ExpensesData;
      } catch (error) {
        console.error(error);
        throw Error('Failed to get Expenses !!!');
      }
}

export const getIncomesById = async( db: SQLiteDatabase, IncomesId: string ): Promise<any> => {
    try{
        const IncomesData : any = [];
        const query = `SELECT * FROM Incomes WHERE id=?`;
        const results = await db.executeSql(query,[IncomesId]);
        return results[0].rows.item(0)
      } catch (error) {
        console.error(error);
        throw Error('Failed to get Incomes !!!');
      }
}

export const getExpensesById = async( db: SQLiteDatabase, ExpensesId: string ): Promise<any> => {
    try{
        const ExpensesData : any = [];
        const query = `SELECT * FROM Expenses WHERE id=?`;
        const results = await db.executeSql(query,[ExpensesId]);
        return results[0].rows.item(0)
      } catch (error) {
        console.error(error);
        throw Error('Failed to get Expenses !!!');
      }
}


export const createIncomes = async( 
        db: SQLiteDatabase,
        name: string,
        value : string
    ) => {
    try{
        const query = 'INSERT INTO Incomes(name,value) VALUES(?,?)';
        const parameters = [name,value]
        await db.executeSql(query,parameters);
      } catch (error) {
        console.error(error);
        throw Error('Failed to create Incomes !!!');
      }
}

export const createExpenses = async( 
    db: SQLiteDatabase,
    name: string,
    value : string
) => {
try{
    const query = 'INSERT INTO Expenses(name,value) VALUES(?,?)';
    const parameters = [name,value]
    await db.executeSql(query,parameters);
  } catch (error) {
    console.error(error);
    throw Error('Failed to create Expenses !!!');
  }
}

export const updateIncomes = async( 
    db: SQLiteDatabase,
    name: string,
    value : string,
    IncomesID: string
) => {
try{
    const query = 'UPDATE Incomes SET name=?,value=? WHERE id=?';
    const parameters = [name,value, IncomesID]
    await db.executeSql(query,parameters);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update Incomes !!!');
  }
}

export const updateExpenses = async( 
    db: SQLiteDatabase,
    name: string,
    value : string,
    ExpensesID: string
) => {
try{
    const query = 'UPDATE Expenses SET name=?,value=? WHERE id=?';
    const parameters = [name,value, ExpensesID]
    await db.executeSql(query,parameters);
  } catch (error) {
    console.error(error);
    throw Error('Failed to update Expenses !!!');
  }
}

export const deleteExpenses = async( 
    db: SQLiteDatabase,
    ExpensesId: string
    ) => {
    try{
        const query = 'DELETE FROM Expenses WHERE id = ?' ;
        await db.executeSql(query,[ExpensesId]);
    } catch (error) {
        console.error(error);
        throw Error('Failed to delete Expenses !!!');
    }
}

const openCallback = () => {
    console.log('database open success');
}

const errorCallback = (err: any) => {
    console.log('Error in opening the database: ' + err);
}
