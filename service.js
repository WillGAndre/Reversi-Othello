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
    this.update = async function (data) {
        let ret = null;
        
        this.events = new EventSource(this.ServerUrl + this.APIEndPoints.update + this.encodeQueryParams(data));
        this.events.onopen = function () {
            console.log("Connection is open");
        }
        this.events.onmessage = function (event) {
            ret = JSON.parse(event.data);
        }
        this.events.onerror = function () {
            console.log("Error in connection " + this.events.readyState);
            this.events.close();
            setInterval(() => {
                if (this.events.readyState == EventSource.CLOSED) {
                    this.update(data);
                }
            }, 4000);
        }
        // this.events.close();       Must close when game ends
        return ret;
    }

    // POST
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
    this.join = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.join, data);
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
            ret = ret.substring(0, ret.length - 2);
        }
        return ret;
    }
}