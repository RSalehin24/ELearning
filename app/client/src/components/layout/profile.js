import React, { useState } from "react";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile.action";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Profile = (props) => {
  const promise = axios.get("http://localhost:3000/profile/details", {
    params: {
      id: props.auth.user.id,
    },
  });

  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [education, setEducation] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...profile,
      username: username,
      email: profile.email,
      education: education,
      country: country,
      state: state,
    };
    console.log(userData);
    if (userData != profile) {
      axios
        .post("http://localhost:3000/profile/update", userData)
        .then((res) => {
          console.log(res);
          setProfile(res.data);
        });
    }
  };

  if (profile === null) {
    promise.then((user) => {
      console.log(user.data);
      setProfile(user.data);
      setUsername(user.data.username);
      setEducation(user.data.education);
      setCountry(user.data.country);
      setState(user.data.state);
    });
    return <h2>profile loading ...</h2>;
  } else {
    return (
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img className="rounded-circle mt-5" src="" />
              <span className="font-weight-bold">{profile.username}</span>
              <span className="text-black-50">{profile.email}</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Profile Settings</h4>
              </div>
              <form noValidate onSubmit={(e) => onSubmit(e)}>
                <div className="row mt-2">
                  <div className="form-group col-md-6">
                    <label htmlFor="username" className="labels">
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={props.errors ? props.errors.username : ""}
                      id="username"
                      type="text"
                      placeholder={profile.username}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group col-md-12">
                    <label htmlFor="email" className="labels">
                      Email
                    </label>
                    <input
                      value={profile.email}
                      id="email"
                      type="email"
                      placeholder={profile.email}
                      className="form-control "
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label className="labels">Education</label>
                    <input
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      id="education"
                      type="text"
                      placeholder="subject/specialization in instritute"
                      className="form-control "
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="form-group col-md-6">
                    <label htmlFor="country" className="labels">
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      id="country"
                      type="text"
                      placeholder="country"
                      className="form-control "
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="state" className="labels">
                      State/Region
                    </label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      id="state"
                      type="text"
                      placeholder="state"
                      className="form-control "
                    />
                  </div>
                </div>
                <div className="form-group mt-5 text-center">
                  <input
                    type="submit"
                    className="btn btn-primary text-white py-2 px-4 btn-block"
                    value="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const instructorInfo = () => {
  return (
    <div className="col-md-4">
      <div className="p-3 py-5">
        <div className="d-flex justify-content-between align-items-center experience">
          <span>Edit Experience</span>
        </div>
        <div className="col-md-12">
          <label htmlFor="experience" className="labels">
            Experience
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="experience"
            value=""
          />
        </div>
        <div className="col-md-12">
          <label className="labels">Additional Details</label>
          <input
            type="text"
            className="form-control"
            placeholder="additional details"
            value=""
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: (userID) => {
      dispatch(getProfile(userID));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
