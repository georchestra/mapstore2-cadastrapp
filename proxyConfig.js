// this file contains configurations for dev proxy

const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost:8080";
const cookie = "JSESSIONID=node0fieai9vvjzcv1uhtlkbbmp7jt4043608.node0";
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
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore/`,
        secure: false
    },
    "/mapstore/proxy": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}`,

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
