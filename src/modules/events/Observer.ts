import { Message } from "../interfaces/interfaces";

export interface Observer {
    update(message: Message): Promise<void>;
}

export class Subject {
    private observers: Observer[] = [];

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex > -1) {
            this.observers.splice(observerIndex, 1);
        }
    }

    public async notify(message: Message): Promise<void> {
        await Promise.all( this.observers.map(async(observer)=>{
            await observer.update(message)
        }))
    }
}
