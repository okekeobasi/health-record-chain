const routes = require("next-routes")();

//Record Routes
routes
    .add("/records/new", "records/new")
    .add("/records/:address", "/records/show")
    .add("/records/:address/personal", "/records/personal")
    .add("/records/:address/appointments", "/records/appointments")
    .add("/records/:address/appointments/new", "/records/appointments/new")
    .add("/records/:address/conditions", "/records/conditions")
    .add("/records/:address/conditions/new", "/records/conditions/new")
    .add("/records/:address/medications", "/records/medications")
    .add("/records/:address/medications/new", "/records/medications/new");

//Provider Routes
routes
    .add("/provider/new", "/provider/new")
    .add(
        "/provider/records/:address/appointments",
        "/provider/records/appointments"
    );

module.exports = routes;
