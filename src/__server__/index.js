import Mock from "./mock";
import "./__db__/users";
import "./__db__/vendor";
import "./__db__/dashboard";
Mock.onAny().passThrough();