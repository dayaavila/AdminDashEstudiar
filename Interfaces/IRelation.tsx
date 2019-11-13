export interface IRelation {
    dataSourceField: string;
    masterField?: string;
    masterValue?: string;   //podemos pasar un valor fijo en lugar del nombre del campo (anterior).
}