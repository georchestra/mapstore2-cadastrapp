const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost:8080";
module.exports = {
    "/rest": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    },
    "/pdf": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    },
    "/mapstore/pdf": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    },
    "/proxy": {
        // proxy of GeOrchestra is already configured
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    },
    "/geonetwork": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}/geonetwork`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    },
    "/header": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`
        }
    }
}