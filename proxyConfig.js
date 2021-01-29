// this file contains configurations for dev proxy

const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost:8080";
const cookie = "_hp2_props.2826793817=%7B%22account_state%22%3A%22active%22%7D; _hp2_id.2826793817=%7B%22userId%22%3A%221499114905535127%22%2C%22pageviewId%22%3A%222428177607153135%22%2C%22sessionId%22%3A%222201495479166025%22%2C%22identity%22%3A%223635521%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%7D; _ga=GA1.2.418248975.1607951243; JSESSIONID=node0zn0cohqg5jw2qn4nddqynxiw70196.node0";
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
        target: `https://dev.mapstore.geo-solutions.it/mapstore`,
        secure: false
    },
    "/mapstore/proxy": {
        target: `https://dev.mapstore.geo-solutions.it`,
        secure: false
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
    },
    "/cadastrapp": {
        target: `https://georchestra.geo-solutions.it`,
        secure: false,
        headers: {
            host: `georchestra.geo-solutions.it`
        },
        onProxyReq: function(proxyReq) {
            proxyReq.setHeader("Cookie",
                // "JSESSIONID=" + ProxySession[buildType].JSESSIONID + ";msa=" + ProxySession[buildType].msa + ";msa_rmc=" + ProxySession[buildType].msa_rmc + ";msa_rmc_disabled=" + ProxySession[buildType].msa_rmc
                cookie);
        }

    }
};