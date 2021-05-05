/* eslint-disable no-throw-literal */
/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
import getCountryCode from './getCountryCode'

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export default {
    apiKey: process.env.REACT_APP_GOOGLE_BOOKS_APIKEY,

    baseUrl: 'https://www.googleapis.com/books/v1',

    fields: {
        title: 'intitle',
        author: 'inauthor',
        publisher: 'inpublisher',
        subject: 'subject',
        isbn: 'isbn'
    },

    cache: new Map(),
    
    countryCode: getCountryCode(),

    _userAccessToken: null,








    /**
     * Abort the api call
     */
    abort() {
        source.cancel()
    },








    // Errors
    _AuthorizationError: (() => {
        return class extends Error {
            constructor(mess) {
                super(mess);
                this.name = 'UNAUTHENTICATED';
            }
        }
    })(),








    /**
     * @private
     * @param {String} str 
     * @param {integer} length 
     * @returns 
     */
    _onlyLettersAndDigits(str, length = 0) {
        return str.matches("^[a-zA-Z0-9]+$") && (length > 0 ? str.length === length : true);
    },





    

    /**
     * save the user token to access google api
     * 
     * @private
     * @param {String | Function} token 
     */
    setUserAccessToken(token = null) {
        this._userAccessToken = token;
    },




    /**
     * Return the oauth token for user autentication.
     * If not exist return 'null'.
     * 
     * @private
     * @return {String}
     */
    _getOAuthToken() {
        if (typeof this._userAccessToken === 'string') {
            return this._userAccessToken;
        } else if (typeof callback === "function") {
            return this._userAccessToken();
        } else {
            // return default
            try {
                let user = JSON.parse(localStorage.getItem('user'));
                return user?.token ?? null;
            } catch (error) {
                return null
            }
        }
    },










    /**
     * Return the HTTP headers for axios request.
     * 
     * @private
     * @param {Boolean} needAuth
     * @returns {Object}
     */
    _getHeaders(needAuth=false) {
        let headers = {
            'Content-Type': 'application/json',
        };
        const token = this._getOAuthToken();
        if (token && needAuth) headers.Authorization = 'Bearer ' + token;
        return headers;
    },












    /**
     * HTTP request errors handler. Optionally accepts a custom handler
     * 
     * @private
     * @param {Object} error 
     * @param {Function} callback A custom error handler
     * @returns 
     */
    _httpRequestErrorsHandler(error, callback = null) {
        // if receive a callback
        if (typeof callback === 'function')
            return callback(error);
        // else continue with default handle
        if (error.response) {
            // Request made and server responded
            if (error.response.status === 401) {
                this.abort();
                throw new this._AuthorizationError(error.response.data.error.message);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.warn(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.warn('Error', error.message);
        }
    },











    /**
     * Perform a request with received params
     * 
     * @param {String} method 
     * @param {String} url 
     * @param {Object} headers 
     * @returns 
     */
    async _httpRequest(url, headers, method = 'get', caching = true) {
        let init = {
            headers,
            cancelToken: source.token
        };

        const params = { method, url, ...init };
        const cacheKey = JSON.stringify(params);
        const cacheValue = this.cache.has(cacheKey) ? this.cache.get(cacheKey) : null;

        try {
            // if exist in cache
            if (cacheValue) return Promise.resolve(JSON.parse(cacheValue));
            // else
            // perform api call
            const res = await axios({ method, url, ...init });
            // customize object
            const customRes = {
                ...res.data,
                status: res.status
            };
            // caching result
            caching && this.cache.set(cacheKey, JSON.stringify(customRes));
            // return result
            return customRes;
        } catch (error) {
            if (axios.isCancel(error))
                throw new Error(`Request canceled: ${error.message ?? ''}`);
            else if (error.name === 'SyntaxError')
                console.warn(error)
            else throw error
        }
    },











    /**
     * Perform a POST request with received params
     * 
     * @private
     * @param {String} query 
     * @param {String} requiredFields 
     * @param {Boolean} authorization
     * @param {Boolean} caching Enable/Disable caching for this call
     * @returns 
     */
    async _httpGetRequest(query, requiredFields = null, authorization = false, caching = true) {
        // if query not contains '?' append it to the end
        if (!query.includes('?')) query += '?';
        // then
        let country = '';
        try {
            country = await this.countryCode();
        } catch (err) {
            console.warn(err);
            country = navigator.language || navigator.userLanguage;
            country = country.split('-').pop();
        }
        let fullUrl = `${this.baseUrl}/${query}&key=${this.apiKey}&country=${country}`;
        fullUrl += requiredFields ? `&fields=${requiredFields}` : ``;
        const headers = this._getHeaders(authorization);
        // if not a valid token
        if (!headers.Authorization && authorization) throw new this._AuthorizationError('Need authentication to access your library');
        // else
        try {
            return this._httpRequest(fullUrl, headers, 'get', caching);
        } catch (error) {
            this._httpRequestErrorsHandler(error);
        }
    },












    /**
     * Perform a POST request with received query
     * 
     * @private
     * @param {String} query 
     * @returns 
     */
    async _httpPostRequest(query, authentication=true) {
        // if query not contains '?' append it to the end
        if (!query.includes('?')) query += '?';
        // then
        const fullUrl = `${this.baseUrl}/${query}&key=${this.apiKey}`;
        const headers = this._getHeaders(authentication);
        // if not a valid token
        if (!headers.Authorization) throw new this._AuthorizationError('Need authentication to access your library');
        // else
        try {
            return this._httpRequest(fullUrl, headers, 'post', false);
        } catch (error) {
            this._httpRequestErrorsHandler(error);
        }
    },











    /**
     * Return the volume data
     * 
     * @param {String} volumeId
     * @returns {Object}
     */
    async getVolume(volumeId) {
        const requiredFields = 'id,volumeInfo(title,authors,publisher,publishedDate,description,pageCount,printType,mainCategory,categories,industryIdentifiers/identifier,averageRating,ratingsCount,imageLinks,language),saleInfo,userInfo(isInMyBooks,isPurchased),accessInfo(accessViewStatus,epub/isAvailable,epub/downloadLink,pdf/isAvailable,pdf/downloadLink,webReaderLink)';
        const path = `volumes/${encodeURI(volumeId)}`;
        try {
            const get_volume = this._httpGetRequest(path, requiredFields);
            return Promise.allSettled([get_volume])
                .then(([volume]) => {
                    if (volume.status === 'fulfilled') {
                        return volume.value ?? [];
                    } else {
                        throw volume.reason;
                    } 
                })
                .catch(err => {
                    throw err;
                });
        } catch (error) {
            throw error;
        }
    },











    /**
     * Returns query results as an array of objects
     * 
     * @param {Object} param0
     * @returns {Array}
     */
    async search({ ...args }) {
        let { query, params, fields, startIndex = 0, maxResults = 10 } = args;
        // create params array
        let _params = [`startIndex=${startIndex}`, `maxResults=${maxResults}`];
        for (let param in params) {
            _params.push(`${param}=${params[param]}`);
        }

        const requiredFields = `items(id,volumeInfo(${fields || 'title,authors,imageLinks,description,averageRating'}),saleInfo)`;
        const path = `volumes?q=${encodeURI(query)}&${_params.join('&')}&`;

        try {
            return this._httpGetRequest(path, requiredFields);
        } catch (error) {
            throw error;
        }
    },










    /**
     * 
     * @param {String} query The keyword
     * @param {String} field Where to look for keyword. Can receive a list of field separed by comma (title, author, ecc...)
     * @param {Number} maxResults Max number of results to return
     * @returns 
     */
    async autocomplete(query, {
        fields = null,
        maxResults = 40
    }) {
        const params = {
            maxResults
        };
        query = query.toLowerCase();
        // if field is not null
        fields = fields ? fields.split(',') : [];
        // return a string like: query field:query field:query...
        query = query + fields.map(field => this.fields[field] ? this.fields[field] + ':' + query : '').join(' ');
        // build string of required fields in results search
        fields = 'title,authors,publisher,industryIdentifiers/identifier,mainCategory,categories';
        //
        const matchSearch = function searchIn(query, value) {
            let matchStart = -1;
            let matched_substring = [];

            if (typeof value === 'string') {
                // if text is too long, skip
                if (value.length > 50) {
                    return {
                        matched_substring,
                        main_text: value
                    };
                }
                matchStart = value.toLowerCase().indexOf(query);
                matched_substring = matchStart > -1 ? [{
                    offset: matchStart,
                    length: query.length
                }] : [];
                return {
                    matched_substring,
                    main_text: value
                };
            } else if (Array.isArray(value)) {
                for (let val of value) {
                    return searchIn(query, val);
                }
            } else if (typeof value === 'object') {
                for (let key in value) {
                    return searchIn(query, value[key]);
                }
            }
        };
        // string where the keyword is found
        let main_text = '';
        let matched_substring = [];

        try {
            let res = await this.search({
                query,
                params,
                fields
            });

            if (!Boolean(res.items?.length)) return [];
            // else
            // return formatted array of object
            res = res.items.map(o => {

                let volume = o.volumeInfo;
                // looking for match in object values
                for (let key in volume) {
                    ({
                        main_text,
                        matched_substring
                    } = matchSearch(query, volume[key]));
                    if (matched_substring.length) break;
                }

                return {
                    main_text,
                    matched_substring
                };
            });
            // filter unmatched
            res = res.filter(o => o.matched_substring.length);
            // return uniques
            res = [...new Map(res.map(item => [JSON.stringify(item), item])).values()];
            // sort by priority
            res = res.sort((a, b) => a.matched_substring.offset < b.matched_substring.offset);
            //
            return res;
        } catch (error) {
            throw error;
        }
    },









    /**
     * Return a listing of all of the authenticated user's bookshelves
     * 
     * @returns {Array}
     */
    async getMyBookshelves() {
        const requiredFields = 'items(id,title,volumeCount)';
        const path = `mylibrary/bookshelves`;

        try {
            return this._httpGetRequest(path, requiredFields, true, false);
        } catch (error) {
            throw error;
        }
    },









    /**
     * Returns a listing of the volumes on the authenticated user's bookshelf
     * 
     * @param {number} id Bookshelf id
     * @param {number} limit The maximum number of elements to return
     * @param {number} startIndex The position in the collection at which to start the list of results.
     * @returns 
     */
    async getMyBookshelfVolumes(shelfID, { maxResults = 10, startIndex = 0 }) {
        // if not a valid shelf id (must be an integer)
        if (!(shelfID >= 0)) throw new Error(`'${shelfID}' is not a valid shelf id`);
        // else
        const requiredFields = 'items/id,items/volumeInfo(title,authors,imageLinks,description),totalItems';
        const path = `mylibrary/bookshelves/${shelfID}/volumes?maxResults=${maxResults}&startIndex=${startIndex}`;

        try {
            return this._httpGetRequest(path, requiredFields, true, false);
        } catch (error) {
            throw error;
        }
    },










    /**
     * Add a volume to the authenticated user's bookshelf
     * 
     * @private
     * @param {Number} shelfID 
     * @param {String} volumeID 
     * @returns 
     */
    async _addVolumeToMyBookshelf(shelfID, volumeID) {
        const query = `mylibrary/bookshelves/${shelfID}/addVolume?volumeId=${volumeID}`;

        try {
            return this._httpPostRequest(query);
        } catch (error) {
            throw error;
        }
    },











    /**
     * Remove a volume from the authenticated user's bookshelf
     * 
     * @private
     * @param {Number} shelfID 
     * @param {String} volumeID 
     * @returns 
     */
    async _removeVolumeToMyBookshelf(shelfID, volumeID) {
        const query = `mylibrary/bookshelves/${shelfID}/removeVolume?volumeId=${volumeID}`;

        try {
            return this._httpPostRequest(query);
        } catch (error) {
            throw error;
        }
    },











    /**
     * Add a volume to the authenticated user's Favorites bookshelf
     * 
     * @param {String} volumeID 
     * @returns 
     */
    async addToMyFavorites(volumeID) {
        const shelfID = 0;

        try {
            return this._addVolumeToMyBookshelf(shelfID, volumeID);
        } catch (error) {
            throw error;
        }
    },











    /**
     * Add a volume to the authenticated user's To Read bookshelf
     * 
     * @param {String} volumeID 
     * @returns 
     */
    async addToMyToRead(volumeID) {
        const shelfID = 2;

        try {
            return this._addVolumeToMyBookshelf(shelfID, volumeID);
        } catch (error) {
            throw error;
        }
    },











    /**
     * Remove a volume from the authenticated user's Favorites bookshelf
     * 
     * @param {String} volumeID 
     * @returns 
     */
    async removeFromMyFavorites(volumeID) {
        const shelfID = 0;

        try {
            return this._removeVolumeToMyBookshelf(shelfID, volumeID);
        } catch (error) {
            throw error;
        }
    },











    /**
     * Remove a volume from the authenticated user's To Read bookshelf
     * 
     * @param {String} volumeID
     * @returns 
     */
    async removeFromMyToRead(volumeID) {
        const shelfID = 2;

        try {
            return this._removeVolumeToMyBookshelf(shelfID, volumeID);
        } catch (error) {
            throw error;
        }
    },










    /**
     * Return true if the volume is in the given bookshelf
     * 
     * @private
     * @param {String} volumeID 
     * @param {Number} bookshelfID 
     * @param {Number} startIndex 
     * @returns 
     */
    async _isVolumeInBookshelf(volumeID, bookshelfID, startIndex = 0) {
        // need bookshelf list
        const limit = 40;
        const bookshelf = await this.getMyBookshelfVolumes(bookshelfID, limit, startIndex);
        let inArray = bookshelf.items.findIndex(o => o.id === volumeID) > -1;

        if (!inArray) {
            startIndex += limit;
            if (bookshelf.totalItems > startIndex)
                return this._isVolumeInBookshelf(volumeID, bookshelfID, ++startIndex);
            else
                return false;
        } else return true;
    },








    /**
     * Return true if the volume is in the favorites bookshelf, else return false
     * 
     * @param {String} volumeID
     * @returns
     */
    async isFavorite(volumeID) {
        const shelfID = 0;

        try {
            return this._isVolumeInBookshelf(volumeID, shelfID);
        } catch (error) {
            throw error;
        }
    },








    /**
     * Return true if the volume is in the To Read bookshelf, else return false
     * 
     * @param {String} volumeID
     * @returns
     */
    async isToRead(volumeID) {
        const shelfID = 2;

        try {
            return this._isVolumeInBookshelf(volumeID, shelfID);
        } catch (error) {
            throw error;
        }
    },
}