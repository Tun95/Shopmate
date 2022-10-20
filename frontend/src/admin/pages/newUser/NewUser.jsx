import React from "react";
import "./newUser.css";

function NewUser() {
  return (
    <div className="new-user-edit">
      <div className="new-box">
        <div className="newUser">
          <h1 className="newuserTitle">New User</h1>
          <form action="" className="newUserForm">
            <div className="newUserItem">
              <label htmlFor="">Username</label>
              <input type="text" placeholder="tunji" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Full Name</label>
              <input type="text" placeholder="Tunji Akande" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Email</label>
              <input type="email" placeholder="tunji@gmail.com" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Password</label>
              <input type="password" placeholder="password" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Phone</label>
              <input type="text" placeholder="+1 123 456 78" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Address</label>
              <input type="text" placeholder="New York | USA" />
            </div>
            <div className="newUserItem">
              <label htmlFor="">Gender</label>
              <div className="newUserGender">
                <input type="radio" name="gender" id="male" value="male" />
                <label htmlFor="male">Male</label>
                <input type="radio" name="gender" id="female" value="female" />
                <label htmlFor="female">Female</label>
                <input type="radio" name="gender" id="other" value="other" />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <div className="newUserItem">
              <label htmlFor="">Active</label>
              <select className="newUserSelect" name="active" id="active">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <button className="newUserButton">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewUser;
