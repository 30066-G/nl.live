export class AppRegistry {
    constructor() {
        this.apps = [];
    }

    register(app) {
        this.apps.push(app);
    }

    getAll() {
        return this.apps;
    }

    getById(id) {
        return this.apps.find(app => app.id === id);
    }
}