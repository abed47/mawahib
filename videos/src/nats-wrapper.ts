import * as nats from 'node-nats-streaming';
import { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client: Stan;

    constructor(){}

    get client(){
        if(!this._client){
            throw new Error('Cannot access Nats client before connecting');
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise((resolve, reject) => {
            this._client.on('connect', () => {
                console.log('Connected to Nats');
                resolve(true);
            });
    
            this._client.on('error', err => {
                console.log(err)
                reject(err);
            })
        })
    }
}

export const natsWrapper = new NatsWrapper();