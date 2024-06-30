import {WebComponent} from "@commonweb/core";
import {NewStreamRequest, Stream, Transaction} from "./models";
import {LocalStorageComponent} from "@commonweb/components";
import {Observable, Observer} from "../core";


@WebComponent({
    selector: "expenses-context",
    // language=HTML
    template: `
        <local-storage-value
                property-matcher="id"
                item-key="id"
                streams-list
                key="demo-streams">
        </local-storage-value>
        <local-storage-value
                property-matcher="date"
                item-key="date"
                expenses-list>
        </local-storage-value>
    `,
})
export class ExpensesContext extends HTMLElement {
    public onAppendStreamObservable: Observable<Stream> = new Observable<Stream>();
    public onRemoveStreamObservable: Observable<Stream> = new Observable<Stream>();

    public onStreamAppend(cb: Observer<Stream>) {
        this.onAppendStreamObservable.subscribe(cb);
    }

    public getStreamsSummary(): { available: string, pending: string, debt: string } {
        const streams = this.getAllStreams();
        let availableAmount = 0;
        let pendingAmount = 0;
        let debtAmount = 0;

        streams.forEach((stream) => {
            switch (stream.type) {
                case "Fixed":
                    availableAmount += stream.totalAmountNumber();
                    break;
                case "Debt":
                    debtAmount += stream.totalAmountNumber();
                    break;
                case "Pending":
                    pendingAmount += stream.totalAmountNumber();
                    break;
            }
        });


        return {
            available: availableAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
            pending: pendingAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
            debt: debtAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
        }
    }

    public getAllStreams(): Stream[] {
        let streams: Stream[] = [];
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const storageValue = localStorage.value;
                if (!storageValue) {
                    return;
                }

                streams = storageValue.map(Stream.fromObject);
            })
            .catch(console.error)
            .build()
            .execute();


        return streams;
    }

    public findStreamExpenses(streamId: string) {
        const stream = this.getAllStreams().find((stream: Stream) => stream.id === streamId);
        if (!stream) {
            return [];
        }

        return stream.transactions
    }

    public addNewStream(req: NewStreamRequest) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const stream = req.execute();
                localStorage.append(stream);
                // should return
                this.onAppendStreamObservable.notify(stream);
            })
            .catch(console.error)
            .build()
            .execute();
    }

    public appendTransactionToStream(streamId: string, data: Transaction) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const stream = this.getAllStreams().find((stream: Stream) => stream.id === streamId);
                if (!stream) {
                    return;
                }

                stream.addTransaction(data);
                localStorage.updateValue(stream);
            })
            .catch(console.error)
            .build()
            .execute();


    }

    public removeTransaction(streamId: string, transactionId: string) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const stream = this.getAllStreams().find((stream: Stream) => stream.id === streamId);
                if (!stream) {
                    return;
                }

                stream.removeTransaction(transactionId);
                localStorage.updateValue(stream);
            })
            .catch(console.error)
            .build()
            .execute();
    }

    removeStream(streamID: string) {
        (this as any)
            .query()
            .where(`[streams-list]`)
            .then((localStorage: LocalStorageComponent) => {
                const stream = this.getAllStreams().find((stream: Stream) => stream.id === streamID);
                if (!stream) {
                    console.log("no sttream found",stream)
                    return;
                }

                localStorage.removeItem(streamID);
                this.onRemoveStreamObservable.notify(stream);
            })
            .catch(console.error)
            .build()
            .execute();
    }
}
