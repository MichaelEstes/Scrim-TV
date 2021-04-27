import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import Profile from "./pages/Profile";
import User from "./pages/User";
import Connect from "./pages/Connect";
import WatchContainer from "./pages/Watch/WatchContainer";
import ReadContainer from "./pages/Read/ReadContainer";

export default (
  <Switch>
    <Route path="/" component={Home} exact={true} />
    <Route path="/projects" component={Projects} exact={true} />
    <Route path="/project" component={Project} />
    <Route path="/connect" component={Connect} exact={true} />
    <Route path="/connect/:type" component={Connect} exact={true} />
    <Route path="/login" component={Login} exact={true} />
    <Route path="/register" component={Registration} exact={true} />
    <Route path="/profile" component={Profile} exact={true} />
    <Route path="/user/:id" component={User} exact={true} />
    <Route path="/watch" component={WatchContainer} />
    <Route path="/read" component={ReadContainer} />
    <Route component={Connect} />
  </Switch>
);
