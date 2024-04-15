export type StreamType = `Fixed` | `Debt` | `Pending`
export type TransactionCategory = "Initial" | "Car";

function obtenerFechaCalendario(fechaActual) {
    // Obtener la fecha actual

    // Formatear la fecha
    const fechaCalendario = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    // Devolver la fecha formateada
    return fechaCalendario;
}

function generateUUID() {
    // Generar un array de 16 bytes aleatorios
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);

    // Convertir los bytes a una cadena hexadecimal
    let uuid = "";
    for (const byte of bytes) {
        uuid += byte.toString(16).padStart(2, "0");
    }

    // Insertar los guiones en la posición correcta
    return uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

export class NewStreamRequest {
    public transactions: DayTransaction[] = [];

    constructor(
        public readonly title: string,
        public readonly initialDate: string,
        public readonly type: StreamType,
        public readonly amount: number) {
    }

    public execute(): Stream {

        const initialTransaction = new Transaction(
            generateUUID(),
            "Initial Balance",
            this.amount,
            "Initial",
            new Date(),
            "Initial stream balance"
        );

        const dayTransactions = new DayTransaction(this.initialDate, [initialTransaction]);
        return new Stream(
            generateUUID(),
            this.title,
            this.initialDate,
            this.type,
            [dayTransactions]
        );


    }


}


export class Stream {

    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly initialDate: string,
        public readonly type: StreamType,
        public readonly transactions: DayTransaction[] = [],
    ) {

        this.totalAmount = this.totalAmount.bind(this);
        this.transactionsCount = this.transactionsCount.bind(this);

    }


    public addTransaction(t: Transaction) {
        const calendarDate = obtenerFechaCalendario(t.date);
        const day = this.transactions.find(dt => dt.date === calendarDate);
        if (!day) {
            this.transactions.push(
                new DayTransaction(calendarDate, [t])
            )
            return;
        }

        day.transactions.push(t);
    }

    public static fromObject(object: {
        id: string,
        title: string,
        initialDate: string,
        type: StreamType,
        transactions: DayTransaction[]
    }): Stream {

        const stream = new Stream(
            object.id,
            object.title,
            object.initialDate,
            object.type,
            object.transactions.map(t => new DayTransaction(t.date, t.transactions))
        )
        return stream;
    }

    public totalAmountNumber() {
        if (!this.transactions) {
            return 0;
        }

        return this.transactions.reduce((acc, t) => acc += t.transactions.reduce((totalDay, td) => totalDay += td.amount, 0), 0);
    }

    public totalAmount() {
        return this.totalAmountNumber().toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }


    public transactionsCount() {
        if (!this.transactions) {
            return 0;
        }

        return this.transactions.reduce((acc, t) => acc += t.transactions.length, 0);
    }

    public removeTransaction(transactionId: string) {
        this.transactions.forEach((dt) => {
            const transactionIndex = dt.transactions.findIndex(t => t.id === transactionId);
            if (transactionIndex !== -1) {
                dt.transactions.splice(transactionIndex, 1);
            }
        });
    }
}

export class DayTransaction {


    constructor(
        public readonly date: string,
        public readonly transactions: Transaction[] = []
    ) {
        this.incomes = this.incomes.bind(this);
        this.outcomes = this.outcomes.bind(this);
    }


    public incomes() {
        return this.transactions
            .filter(t => t.amount > 0)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amount;
            }, 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    public outcomes() {
        return this.transactions
            .filter(t => t.amount < 0)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amount;
            }, 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }
}

export class Transaction {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly amount: number,
        public readonly category: TransactionCategory,
        public readonly date: Date,
        public readonly description: string = "") {
    }


}
