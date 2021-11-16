/*
Meta Code
1000 - 2000 - green light - sucess -> such as success, ok, confirm etc...
2000 - 3000 - oragne light - warning -> such as field required etc..
3000 - 4000 - yellow light - 
4000 - 5000 - red light - error -> not existed etc...
5000 - 6000 - pink light - server internal error 

doc for ref - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
*/

export const meta = {
    OK: 2001,
    NEEDTOKEN: 2001,
    UNEXPECTED_ERROR: 4000,
    NOTEXIST: 4001,
    NOTFILETYPE: 4002,
    UNAUTHEORIZED: 4003,
    ERROR: 4004,
    NOTUSERPWD: 4005,
    TOKENEXPIRE: 4006,
    CANNOT_BE_EMPTY: 4007,
    ALREADY_EXIST: 4101,
    INTERNAL_ERROR: 5000,
    OBJECT_MUST_BE_ARRAY: 5001,
    INVALID_DATA: 5002,
    CLOSED: 5003,
}

export const status_type = {
    Cancel: 0,
    Pending: 1,
    Deliver: 2,
    Complete: 3
}

export const stock_out_type = {
    ManualStockOut: 1,
    OrderStockOut: 2
}