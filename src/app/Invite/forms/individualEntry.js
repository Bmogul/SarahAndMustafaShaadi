import React, { useState, useEffect } from "react";

const Component = ({ member, event, updateMember }) => {
  const [eventRes, setEventRes] = useState(undefined);
  const [memberData, setMemberData] = useState(member);
  const [mainFlag, setMainFlag] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const numberOptions = Array.from(
    { length: parseInt(member.MainInvite) },
    (_, index) => index + 1,
  );
  // Handle changes when an option is selected
  const handleChange = (event) => {
    let pplComing =
      event.target.value >= 0 || event.target.value == ""
        ? event.target.value
        : 0;
    setSelectedValue(pplComing);
    pplComing = pplComing ? pplComing : 0;
    const updatedMemberData = { ...memberData };
    updatedMemberData[eventRes] = pplComing;
    setMemberData(updatedMemberData);
    updateMember(updatedMemberData);
  };

  useEffect(() => {
    switch (event) {
      case "Shitaabi":
        setEventRes("ShitabiResponse");
        break;
      case "Mamu Mosallo":
        setEventRes("WalimoResponse");
        break;
      case "Rukhsati":
        setEventRes("MainResponse");
        setMainFlag(member.MainFlag ? parseInt(member.MainFlag) : 0);
        setSelectedValue(parseInt(member.MainResponse));
        break;
      default:
        setEventRes(null);
        break;
    }
  }, [event]);

  const handleButtonClick = (response) => {
    const updatedMemberData = { ...memberData };
    updatedMemberData[eventRes] = response ? 1 : 0;
    setMemberData(updatedMemberData);
    updateMember(updatedMemberData);
  };

  const isYesButtonActive = parseInt(memberData[eventRes]) === 1;
  const isNoButtonActive = parseInt(memberData[eventRes]) === 0;

  const renderMainFlag = () => {
    switch (mainFlag) {
      case 0:
        return (
          <div className="individualEntry">
            <div className="col-md-4">
              <label className="fs-5">
                {member.Name}
              </label>
            </div>
            <div className="col-md-3">
              <button
                className={`rounded-4 fs-5 rsvpResBtn ${
                  isYesButtonActive ? "rsvpResBtnS" : ""
                }`}
                onClick={() => handleButtonClick(true)}
              >
                Yes
              </button>
            </div>
            <div className="col-md-3">
              <button
                className={`rounded-4 fs-5 rsvpResBtn ${
                  isNoButtonActive ? "rsvpResBtnS" : ""
                }`}
                onClick={() => handleButtonClick(false)}
              >
                No
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="individualEntry">
            <div className="col-md-4">
              <label className="fs-5">
                How Many People Shall be Attending?
              </label>
            </div>
            <div className="col-md-3">
              <select
                id="numberSelect"
                name="numberSelect"
                className="selectRSVP"
                value={selectedValue}
                onChange={handleChange}
              >
                <option value="0">0</option>
                {numberOptions.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="individualEntry">
            <div className="col-md-4">
              <label className="fs-5">
                How Many People Shall be Attending?
              </label>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                className="selectRSVP"
                value={selectedValue}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      {(eventRes !== undefined) & (eventRes !== null) ? (
        renderMainFlag()
      ) : (
        <div>
          <label>Hello {eventRes}</label>
          <label>Hello {eventRes}</label>
        </div>
      )}
    </div>
  );
};

export default Component;
