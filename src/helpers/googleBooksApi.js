/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

export default {
    apiKey: process.env.REACT_APP_GOOGLE_BOOKS_APIKEY,
    baseUrl: 'https://www.googleapis.com/books/v1',
    cancelTokenSource: axios.CancelToken.source(),
    /**
     * Abort the api call
     */
    abort() {
        this.cancelTokenSource.cancel();
    },
    // Errors
    _AuthorizationError(mes) {
        this.name = 'AuthorizationError';
        this.message = mes;
    },

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
     * Return the oauth token for user autentication stored in localStorage (user.token).
     * If not exist return 'null'.
     * 
     * @private
     * @param {String} token 
     */
    _getOAuthToken() {
        try {
            let user = JSON.parse(localStorage.getItem('user'));
            return user?.token ?? null;
        }
        catch (error) { return null }
    },

    /**
     * Return the HTTP headers for axios request.
     * 
     * @private
     * @returns {Object}
     */
    _getHeaders() {
        let headers = {'Content-Type': 'application/json'};
        const token = this._getOAuthToken();
        if(token) headers.Authorization = token;
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
            if( error.response.status === 401)
                throw this._AuthorizationError(error.response.data.error.message);
            
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
    async _httpRequest(url, headers, method = 'get') {
        let init = {
            headers,
            cancelToken: this.cancelTokenSource.token
        };
        try {
            const res = await axios[method](url, init);
            return { ...res.data, status: res.status };
        } catch (error) {
            if (error.name === 'SyntaxError')
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
     * @returns 
     */
    async _httpGetRequest(query, requiredFields = null, authorization = false) {
        // if query not contains '?' append it to the end
        if (!query.includes('?')) query += '?';
        // then
        let fullUrl = `${this.baseUrl}/${query}key=${this.apiKey}`;
        fullUrl += requiredFields ? `&fields=${requiredFields}` : ``;
        const headers = this._getHeaders();
        // if not a valid token
        if (!headers.Authorization && authorization) throw new Error("Need autentication to access to private library");
        // else
        try {
            return await this._httpRequest(fullUrl, headers, 'get');
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
    async _httpPostRequest(query) {
        // if query not contains '?' append it to the end
        if (!query.includes('?')) query += '?';
        // then
        const fullUrl = `${this.baseUrl}/${query}key=${this.apiKey}`;
        const headers = this._getHeaders();
        // if not a valid token
        if (!headers.Authorization) throw new Error("Need autentication to access to private library");
        // else
        try {
            return await this._httpRequest(fullUrl, headers, 'post');
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
        const requiredFields = 'volumeInfo(title,authors,publisher,publishedDate,description,pageCount,printType,mainCategory,categories,industryIdentifiers/identifier,averageRating,ratingsCount,imageLinks,language),saleInfo';
        const path = `volumes/${encodeURI(volumeId)}`;
        try {
            const _volume = this._httpGetRequest(path, requiredFields);
            const _isFavourite = this._isVolumeInBookshelf(volumeId, 0);
            const _isToRead = this._isVolumeInBookshelf(volumeId, 2);
            return Promise.allSettled([_volume, _isFavourite, _isToRead])
                .then(([volume, isFavorite, isToRead]) => {
                    if (volume.status === 'fulfilled') {
                        volume.value.isFavorite = isFavorite.status === 'fulfilled' ? isFavorite.value : false;
                        volume.value.isToRead = isToRead.status === 'fulfilled' ? isToRead.value : false;
                        return volume.value;
                    }
                    else throw new Error("Request failed");
                })
                .catch(err => {
                    if (err instanceof this._AuthorizationError) { }
                    else throw err;
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
    async searchVolumes({ ...args }) {
        let { query, fields, params } = args;
        // add fields to query
        for (let field in fields) {
            query += ' ' + field + ':' + fields[field];
        }
        // create params array
        let _params = [];
        for (let param in params) {
            _params.push(`${param}=${params[param]}`);
        }
        
        const requiredFields = 'id,volumeInfo(title,authors,imageLinks)';
        const path = `volumes?q=${encodeURI(query)}&${_params.join('&')}`;

        try {
            return await this._httpGetRequest(path, requiredFields);
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
            return await this._httpGetRequest(path, requiredFields, true);
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
    async getMyBookshelfVolumes(shelfID, limit = 10, startIndex = 0) {
        // if not a valid shelf id (must be an integer)
        if (!Number.isInteger(shelfID) || shelfID < 0) throw new Error(`'${shelfID}' is not a valid shelf id`);
        // else
        const requiredFields = 'id,volumeInfo(title,authors,imageLinks),totalItems';
        const path = `mylibrary/bookshelves/${shelfID}/volumes?maxResults=${limit}&startIndex=${startIndex}`;

        try {
            return await this._httpGetRequest(path, requiredFields, true);
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
        const query = `/bookshelves/${shelfID}/volumes?volumeId=${volumeID}`;

        try {
            return await this._httpRequest(query);
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
        const query = `/bookshelves/${shelfID}/removeVolume?volumeId=${volumeID}`;

        try {
            return await this._httpRequest(query);
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
            return await this._addVolumeToMyBookshelf(shelfID, volumeID);
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
            return await this._addVolumeToMyBookshelf(shelfID, volumeID);
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
            return await this._removeVolumeToMyBookshelf(shelfID, volumeID);
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
    async removeFromToMyToRead(volumeID) {
        const shelfID = 2;

        try {
            return await this._removeVolumeToMyBookshelf(shelfID, volumeID);
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
        let inArray = bookshelf.items.find(o => o.id === volumeID) > -1;

        if (!inArray) {
            startIndex += limit;
            if (bookshelf.totalItems > startIndex)
                return this._isVolumeInBookshelf(volumeID, bookshelfID, ++startIndex);
            else
                return false;
        }
        else return true;
    }
}