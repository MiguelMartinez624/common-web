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

export class NewNoteRequest {
    constructor(
        public readonly title,
        public readonly content,
    ) {
    }

    public execute(): Note {
        return new Note(
            generateUUID(),
            this.title,
            this.content,
            new Date()
        )
    }
}

export class Note {


    constructor(
        public readonly id: string,
        public readonly title,
        public readonly content,
        public readonly creationDate: Date
    ) {
    }


    public static fromObject(obj: { creationDate: string, title: string, id: string, content: string }) {
        return new Note(
            obj.id, obj.title, obj.content, new Date(obj.creationDate)
        )
    }
}