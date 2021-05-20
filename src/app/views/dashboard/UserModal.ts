

interface UserModalBase {
    id: string;
    title: string;
    body: string
}

export class User implements UserModalBase {
    id: string;
    title: string;
    body: string

    constructor(user: UserModalBase) {
        this.id = user.id;
        this.title = user.title.toUpperCase();
    }
}