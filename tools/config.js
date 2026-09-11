const APP_ENV = false;

const link = {
    prod: "https://audit-ops.traxtech.com",
    dev: "http://127.0.0.1:8000"
};

let CONFIG;

if (APP_ENV === true) {
    CONFIG = {
        API_BASE_URL: link.prod
    };
} else {
    CONFIG = {
        API_BASE_URL: link.dev
    };
}