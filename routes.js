const routes = require("next-routes")();

routes
    .add("/records/new", "records/new")
    .add("/records/:address", "/records/show")
    .add("/records/:address/appointments", "/records/appointments")
    .add("/records/:address/appointments/new", "/records/appointments/new")
    .add("/records/:address/conditions", "/records/conditions")
    .add("/records/:address/medications", "/records/medications");

module.exports = routes;
