export type StackParamList = {
    Summary: undefined;
    Login: undefined;
    Register: undefined;
    ViewExpenseIncome: undefined;
    EditExpenseIncome: { id: number };
    CreateExpenseIncome: { type: string };
  };
  
  export type Transaction = {
    id: number;
    description: string;
    amount: number;
  };
  