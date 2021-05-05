/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

class IpStackError extends Error {
    constructor(code = null, ...params) {
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IpStackError)
        }

        this.name = 'IpStackError';
        this.code = code;
    }
}


/**
 * Return a function that return a promise that return the current country code based on user ip
 * @return {Function}
 */
export default function () {
    const apiKey = process.env.REACT_APP_IP_STACK_APIKEY;
    const fields = 'fields=country_code';
    const output = 'output=json';
    // call the api first time only. other times return stored value
    return async () => {
        // if in cache
        if (localStorage.getItem('country_code') !== null)
            return Promise.resolve(localStorage.getItem('country_code'));
        //else
        try {
            const res = await axios.get(`http://api.ipstack.com/check?access_key=${apiKey}&${fields}&${output}`)
            const { error, country_code } = res.data;
            if (error)
                throw new IpStackError(error.code, error.info);
            else {
                localStorage.setItem('country_code', country_code);
                return country_code;
            }
        } catch (err) {
            console.warn(err);
            throw err;
        }
    };
}