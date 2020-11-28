const othelloService = new Service();

function Service() {
    this.ServerUrl = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    this.APIEndPoints = {
        register: "register",
        update: "update",
        join: "join",
        notify: "notify",
        ranking: "ranking",
        leave: "leave"
    }

    // GET
    this.events = null;
    this.msgs = [];
    this.update = async function (data, fnCallback) {
        let ret = null;

        this.events = new EventSource(this.ServerUrl + this.APIEndPoints.update + this.encodeQueryParams(data));
        this.events.onopen = function () {
            console.log("Connection is open");
        }
        this.events.onmessage = fnCallback;
        this.events.onerror = function () {
            this.events.close();
        }.bind(this)

        // this.events.close();       Must close when game ends
        return ret;
    }

    // POST
    this.join = async function (data, fnCallback) {
        const ret = await this.post(this.ServerUrl + this.APIEndPoints.join, data).then(
            (oJoinData) => {
                this.update({
                    nick: data.nick,
                    game: oJoinData.game
                }, fnCallback);
            }
        );
        return ret;
    }
    this.notify = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.notify, data);
    }
    this.ranking = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.ranking, {});
    }
    this.leave = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.leave, data);
    }
    this.register = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.register, data)
    }

    this.post = async function (url, payload) {
        try {
            const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    this.encodeQueryParams = function (data) {
        let aEntries = Object.entries(data);
        let ret = "";
        if (aEntries.length !== 0) {
            ret = "?";
            for (const keyValue of aEntries) {
                ret += keyValue[0] + "=" + encodeURIComponent(keyValue[1]) + "&";
            }
            ret = ret.substring(0, ret.length - 1);
        }
        return ret;
    }
}