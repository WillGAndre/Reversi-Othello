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

    this.join = async function (data, fnCallback) {
        return await this.post(this.ServerUrl + this.APIEndPoints.join, data);
    }

    this.post = async function (url, payload) {
        try {
            const response = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
            if (!response.ok)
                throw new Error(response.statusText);
            const data = await response.json()      // Asynchronous
            return data;
        } catch (error) {
            return error;
        }
    }
}

// Fetch - POST
// async function getFetch(url, payLoad) {
//     try {
//         const response = await fetch(url, { method: 'POST', body: JSON.stringify(payLoad) });
//         if (!response.ok)
//             throw new Error(response.statusText);
//         const data = await response.json()      // Asynchronous
//         return data;
//     } catch (error) {
//         return error;
//     }
// }