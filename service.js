const othelloService = new Service();

// const dummyUser = {'group': 15, 'nick': "ola", 'pass': "ola"}
// othelloService.join(dummyUser, callbackTest);

function Service() {
    this.ServerUrl = "http://twserver.alunos.dcc.fc.up.pt:8008/";
    this.APIEndPoints = {
        register: "register",
        update: "update?nick=__NICKNAME__&game=__GAMEHASH__",
        join: "join",
        notify: "",
        ranking: "",
        leave: ""
    }

    this.update = async function(data){

    }
    this.register = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.register, data);
    }
    
    // let ret = await othelloService.join(data);
    this.join = async function (data) {
        return await this.post(this.ServerUrl + this.APIEndPoints.join, data);
    }

    this.post = async function (url, payload) {
        try {
            const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
            if (!response.ok)
                throw new Error(response.statusText);
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
    this.encodeQueryParams = function(data){
        if(typeof(data)){

        }
        let ret = "?"
    }
}