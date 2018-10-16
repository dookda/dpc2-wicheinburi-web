export class Item {
    constructor(private fields: any) {
        for (const f in fields) {
            if (f) {
                this[f] = fields[f];
            }
        }
    }
}
